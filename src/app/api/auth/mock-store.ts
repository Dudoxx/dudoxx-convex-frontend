// Temporary in-memory store for development
// This will be replaced with proper Convex backend calls once the backend is fixed

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}

interface AuthLog {
  id: string;
  action: string;
  userId: string;
  email: string;
  success: boolean;
  timestamp: string;
}

// In-memory storage (will be lost on server restart)
let users: User[] = [];
let authLogs: AuthLog[] = [];

export class MockAuthStore {
  static async findUserByEmail(email: string): Promise<User | null> {
    return users.find(user => user.email === email) || null;
  }

  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, hash this
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    
    // Log the registration
    this.logAuthEvent({
      action: 'user_registration',
      userId: user.id,
      email: user.email,
      success: true,
    });

    return user;
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    
    if (user && user.password === password) { // In production, use bcrypt.compare
      // Log successful login
      this.logAuthEvent({
        action: 'user_login',
        userId: user.id,
        email: user.email,
        success: true,
      });
      
      return user;
    }

    // Log failed login attempt
    this.logAuthEvent({
      action: 'user_login_failed',
      userId: '',
      email: email,
      success: false,
    });

    return null;
  }

  static async logAuthEvent(eventData: {
    action: string;
    userId: string;
    email: string;
    success: boolean;
  }): Promise<void> {
    const log: AuthLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      action: eventData.action,
      userId: eventData.userId,
      email: eventData.email,
      success: eventData.success,
      timestamp: new Date().toISOString(),
    };

    authLogs.push(log);
  }

  static async getAuthLogs(userId?: string): Promise<AuthLog[]> {
    if (userId) {
      return authLogs.filter(log => log.userId === userId);
    }
    return authLogs;
  }

  static getStats() {
    return {
      totalUsers: users.length,
      totalAuthLogs: authLogs.length,
      mockStore: true,
      warning: 'Using temporary in-memory storage. Data will be lost on restart.',
    };
  }
}

// Pre-populate with a test user for development
if (users.length === 0) {
  MockAuthStore.createUser({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123',
  });
}