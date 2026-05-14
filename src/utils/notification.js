export const requestPermission = async () => {
  if (!('Notification' in window)) {
    console.warn("Browser does not support notifications");
    return false;
  }
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    localStorage.setItem('notificationsEnabled', 'true');
    return true;
  }
  localStorage.setItem('notificationsEnabled', 'false');
  return false;
};

export const sendNotification = (title, body) => {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted' && localStorage.getItem('notificationsEnabled') !== 'false') {
    // Antigravity style icon
    const iconUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';
    const n = new Notification(title, { 
      body, 
      icon: iconUrl,
      requireInteraction: true // Keep it on screen until user clicks
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  }
};
