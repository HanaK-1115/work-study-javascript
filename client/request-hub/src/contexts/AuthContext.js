import React, { createContext, useState, useEffect } from 'react';

// AuthContextの作成
export const AuthContext = createContext();

// AuthProviderコンポーネントの作成
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // ユーザー情報を保存するための状態

  // ログイン状態を保持するための関数
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // ユーザー情報を設定
  };

  // ログアウト状態を保持するための関数
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // ユーザー情報をクリア
  };

  // 初回レンダリング時に認証状態を確認（例：ローカルストレージから）
  useEffect(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    if (storedAuthState) {
      setIsAuthenticated(JSON.parse(storedAuthState));
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 認証状態が変更されたときにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('user', JSON.stringify(user));
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
