import { teachers } from '../data/teacherData';

// Admin credentials (in a real app, this would be in a secure database)
const adminUsers = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123', // In real app, this would be hashed
    name: 'System Administrator',
    role: 'admin'
  }
];

// In a real application, you would use a proper hashing algorithm
const hashPassword = (password) => {
  return btoa(password); // This is NOT secure, just for demo
};

export const authenticateTeacher = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate API call
      try {
        const teacher = teachers.find(t => 
          t.username === username && 
          t.password === password // In real app, compare hashed passwords
        );

        if (teacher) {
          const { password, ...teacherData } = teacher; // Remove password from data
          resolve(teacherData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      } catch (error) {
        reject(new Error('Authentication failed'));
      }
    }, 500);
  });
};

export const authenticateAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate API call
      try {
        const admin = adminUsers.find(a => 
          a.username === username && 
          a.password === password // In real app, compare hashed passwords
        );

        if (admin) {
          const { password, ...adminData } = admin; // Remove password from data
          resolve(adminData);
        } else {
          reject(new Error('Invalid admin credentials'));
        }
      } catch (error) {
        reject(new Error('Admin authentication failed'));
      }
    }, 500);
  });
};

export const logout = () => {
  sessionStorage.clear();
  return Promise.resolve();
}; 