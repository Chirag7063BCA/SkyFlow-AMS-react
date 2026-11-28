import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordPanel } from '../components/LocalComp/ProfileComp/ProfileExtras';
import ProfileGeneralForm from '../components/LocalComp/ProfileComp/ProfileGeneralForm';
import ProfileHeader from '../components/LocalComp/ProfileComp/ProfileHeader';
import ProfileSidebar from '../components/LocalComp/ProfileComp/ProfileSidebar';
import { useAuth } from '../context/useAuth';
import { getBookings } from '../services/bookingApi';

export default function ProfilePage() {
  const { currentUser, isLoggedIn, openAuth, closeAuth, updateProfile, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isLoggedIn) return;
    openAuth('signin', 'Login to view your profile.', null, () => {
      navigate('/', { replace: true });
    });
    return () => closeAuth(false);
  }, [isLoggedIn, openAuth, closeAuth, navigate]);

  const bookings = getBookings(currentUser?.email);

  return (
    <div className={`pf-shell ${isLoggedIn ? '' : 'locked'}`}>
      <ProfileHeader
        user={currentUser}
        totalBookings={bookings.length}
        onPhotoChange={(picture) => updateProfile({ picture })}
      />

      <div className="pf-body">
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showDot={!currentUser?.gender || !currentUser?.phone}
          onLogout={() => {
            handleLogout();
            navigate('/');
          }}
        />

        {activeTab === 'profile' && (
          <ProfileGeneralForm
            key={currentUser?.email || 'guest'}
            user={currentUser}
            onSave={updateProfile}
          />
        )}
        {activeTab === 'password' && <ResetPasswordPanel />}
      </div>
    </div>
  );
}
