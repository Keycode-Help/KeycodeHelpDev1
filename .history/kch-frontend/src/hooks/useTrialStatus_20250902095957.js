import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/request';

export const useTrialStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const [trialStatus, setTrialStatus] = useState({
    hasTrial: false,
    isActive: false,
    remainingDays: 0,
    trialEndsAt: null,
    hasPremiumAccess: false,
    accessType: 'none'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trial status from backend
  const fetchTrialStatus = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setTrialStatus({
        hasTrial: false,
        isActive: false,
        remainingDays: 0,
        trialEndsAt: null,
        hasPremiumAccess: false,
        accessType: 'none'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (import.meta.env.DEV) {
        console.log('Fetching trial status for user:', user);
        console.log('User role:', user?.role);
      }
      
      const response = await api.get('/trial/status');
      if (response.status === 200) {
        setTrialStatus(response.data);
      }
    } catch (err) {
      console.error('Error fetching trial status:', err);
      if (import.meta.env.DEV) {
        console.log('Trial status error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          user: user
        });
      }
      setError('Failed to fetch trial status');
      
      // Fallback: check subscription from user data
      if (user.subscription) {
        const subscription = user.subscription;
        const hasTrial = subscription.trial && subscription.trialEndsAt;
        const isActive = hasTrial && new Date(subscription.trialEndsAt) > new Date();
        const remainingDays = hasTrial && isActive 
          ? Math.ceil((new Date(subscription.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))
          : 0;
        
        setTrialStatus({
          hasTrial,
          isActive,
          remainingDays,
          trialEndsAt: subscription.trialEndsAt,
          hasPremiumAccess: isActive || subscription.activated,
          accessType: isActive ? 'trial' : (subscription.activated ? 'paid' : 'none')
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Start a trial
  const startTrial = useCallback(async (tier = 'BASIC') => {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to start a trial');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/trial/start', null, {
        params: { tier }
      });
      
      if (response.status === 200) {
        // Refresh trial status
        await fetchTrialStatus();
        return response.data;
      }
    } catch (err) {
      console.error('Error starting trial:', err);
      const errorMessage = err.response?.data || 'Failed to start trial';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchTrialStatus]);

  // Check if trial has expired
  const isTrialExpired = useCallback(() => {
    if (!trialStatus.hasTrial || !trialStatus.trialEndsAt) {
      return false;
    }
    return new Date() > new Date(trialStatus.trialEndsAt);
  }, [trialStatus]);

  // Check if user should see trial banner
  const shouldShowTrialBanner = useCallback(() => {
    // Show banner if user is authenticated, has no trial, and no premium access
    return isAuthenticated && 
           user && 
           !trialStatus.hasTrial && 
           !trialStatus.hasPremiumAccess;
  }, [isAuthenticated, user, trialStatus]);

  // Check if user should see trial notice
  const shouldShowTrialNotice = useCallback(() => {
    // Show notice if user has an active trial
    return trialStatus.hasTrial && trialStatus.isActive;
  }, [trialStatus]);

  // Check if user has premium access (trial or paid)
  const hasPremiumAccess = useCallback(() => {
    return trialStatus.hasPremiumAccess;
  }, [trialStatus]);

  // Refresh trial status
  const refreshTrialStatus = useCallback(() => {
    fetchTrialStatus();
  }, [fetchTrialStatus]);

  // Effect to fetch trial status when user changes
  useEffect(() => {
    fetchTrialStatus();
  }, [fetchTrialStatus]);

  // Effect to check trial expiration every hour
  useEffect(() => {
    if (trialStatus.hasTrial && trialStatus.isActive) {
      const interval = setInterval(() => {
        const now = new Date();
        const trialEnd = new Date(trialStatus.trialEndsAt);
        
        if (now > trialEnd) {
          // Trial expired, refresh status
          fetchTrialStatus();
        }
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [trialStatus.hasTrial, trialStatus.isActive, trialStatus.trialEndsAt, fetchTrialStatus]);

  return {
    trialStatus,
    isLoading,
    error,
    startTrial,
    isTrialExpired,
    shouldShowTrialBanner,
    shouldShowTrialNotice,
    hasPremiumAccess,
    refreshTrialStatus
  };
};
