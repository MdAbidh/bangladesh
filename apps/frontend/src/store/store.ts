import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Notification, Course } from '@/types';

interface AuthSliceState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialAuthState: AuthSliceState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

interface CourseSliceState {
  courses: Course[];
  currentCourse: Course | null;
  featuredCourses: Course[];
  popularCourses: Course[];
  myCourses: Course[];
  isLoading: boolean;
  error: string | null;
}

const initialCourseState: CourseSliceState = {
  courses: [],
  currentCourse: null,
  featuredCourses: [],
  popularCourses: [],
  myCourses: [],
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState: initialCourseState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
    setFeaturedCourses: (state, action: PayloadAction<Course[]>) => {
      state.featuredCourses = action.payload;
    },
    setPopularCourses: (state, action: PayloadAction<Course[]>) => {
      state.popularCourses = action.payload;
    },
    setMyCourses: (state, action: PayloadAction<Course[]>) => {
      state.myCourses = action.payload;
    },
    setCourseLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCourseError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

interface UISliceState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  activeModal: string | null;
}

const initialUIState: UISliceState = {
  theme: 'light',
  sidebarOpen: true,
  mobileMenuOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
  },
});

interface NotificationSliceState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

const initialNotificationState: NotificationSliceState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialNotificationState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    setNotificationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setUser: setAuthUser,
  setLoading: setAuthLoading,
  setError: setAuthError,
  clearAuth,
} = authSlice.actions;

export const {
  setCourses,
  setCurrentCourse,
  setFeaturedCourses,
  setPopularCourses,
  setMyCourses,
  setCourseLoading,
  setCourseError,
} = courseSlice.actions;

export const {
  setTheme,
  toggleTheme: toggleUITheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setActiveModal,
} = uiSlice.actions;

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  setNotificationLoading,
} = notificationSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    course: courseSlice.reducer,
    ui: uiSlice.reducer,
    notification: notificationSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
