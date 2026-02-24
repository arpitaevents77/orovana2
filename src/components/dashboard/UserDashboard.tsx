import { useState } from 'react';
import { User, Package, ShoppingCart, MapPin, Bell, Settings, LogOut, CreditCard as Edit3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileSection from './ProfileSection';
import OrderHistory from './OrderHistory';
import CartSection from './CartSection';
import NotificationsSection from './NotificationsSection';

interface UserDashboardProps {
  onCheckout?: () => void;
}

const UserDashboard = ({ onCheckout }: UserDashboardProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, userProfile, signOut } = useAuth();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal">
                  {userProfile?.first_name} {userProfile?.last_name}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-forest-green text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {activeTab === 'profile' && <ProfileSection />}
              {activeTab === 'orders' && <OrderHistory />}
              {activeTab === 'cart' && <CartSection onCheckout={onCheckout} />}
              {activeTab === 'addresses' && <AddressesSection />}
              {activeTab === 'notifications' && <NotificationsSection />}
              {activeTab === 'settings' && <SettingsSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressesSection = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-charcoal">Shipping Addresses</h2>
        <button className="bg-forest-green text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
          Add New Address
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-charcoal">Home</h3>
              <p className="text-gray-600 text-sm mt-1">
                123 Main Street<br />
                Apartment 4B<br />
                New Delhi, Delhi 110001<br />
                India
              </p>
              <p className="text-gray-600 text-sm mt-2">+91 98765 43210</p>
            </div>
            <button className="text-forest-green hover:text-green-800">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-charcoal mb-2">Email Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-sm text-gray-700">Order updates and shipping notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-sm text-gray-700">New product announcements</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm text-gray-700">Promotional offers and discounts</span>
            </label>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-charcoal mb-2">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-sm text-gray-700">Allow product recommendations</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm text-gray-700">Share usage data for improvements</span>
            </label>
          </div>
        </div>

        <div className="border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-3">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;