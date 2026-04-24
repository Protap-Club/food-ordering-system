import React from 'react';

function ProfileView({ user }) {
  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-avatar">{user.name[0]}</div>
        <h2>{user.name}</h2>
        <div className="profile-stats">
          <div><b>₹{user.wallet}</b><span>Wallet</span></div>
          <div><b>{user.loyaltyPoints}</b><span>Points</span></div>
          <div><b>12</b><span>Orders</span></div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
