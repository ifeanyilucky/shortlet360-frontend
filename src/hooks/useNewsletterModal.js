import { useState, useEffect, useCallback } from "react";

export function useNewsletterModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Check if user has already subscribed or dismissed the modal
  const checkUserPreference = useCallback(() => {
    const hasSubscribed = localStorage.getItem("newsletter_subscribed");
    const hasDismissed = localStorage.getItem("newsletter_dismissed");
    const dismissedTime = localStorage.getItem("newsletter_dismissed_time");
    
    // Don't show if user has subscribed
    if (hasSubscribed === "true") {
      return false;
    }
    
    // Don't show if user dismissed within last 7 days
    if (hasDismissed === "true" && dismissedTime) {
      const dismissedDate = new Date(dismissedTime);
      const now = new Date();
      const daysSinceDismissed = (now - dismissedDate) / (1000 * 60 * 60 * 24);
      
      if (daysSinceDismissed < 7) {
        return false;
      }
    }
    
    return true;
  }, []);

  // Show modal based on scroll percentage
  const handleScroll = useCallback(() => {
    if (hasShown || !checkUserPreference()) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Show modal when user scrolls 60% down the page
    if (scrollPercentage > 60) {
      setIsModalOpen(true);
      setHasShown(true);
      window.removeEventListener("scroll", handleScroll);
    }
  }, [hasShown, checkUserPreference]);

  // Show modal after time delay
  const showAfterDelay = useCallback((delay = 30000) => { // 30 seconds default
    if (hasShown || !checkUserPreference()) return;

    const timer = setTimeout(() => {
      setIsModalOpen(true);
      setHasShown(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasShown, checkUserPreference]);

  // Show modal on exit intent (mouse leaving viewport)
  const handleMouseLeave = useCallback((e) => {
    if (hasShown || !checkUserPreference()) return;

    // Only trigger if mouse is leaving from the top of the page
    if (e.clientY <= 0) {
      setIsModalOpen(true);
      setHasShown(true);
      document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [hasShown, checkUserPreference]);

  // Initialize scroll trigger
  const enableScrollTrigger = useCallback(() => {
    if (checkUserPreference()) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, checkUserPreference]);

  // Initialize exit intent trigger
  const enableExitIntentTrigger = useCallback(() => {
    if (checkUserPreference()) {
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [handleMouseLeave, checkUserPreference]);

  // Close modal and handle user preference
  const closeModal = useCallback((subscribed = false) => {
    setIsModalOpen(false);
    
    if (subscribed) {
      localStorage.setItem("newsletter_subscribed", "true");
    } else {
      localStorage.setItem("newsletter_dismissed", "true");
      localStorage.setItem("newsletter_dismissed_time", new Date().toISOString());
    }
  }, []);

  // Manual trigger for specific events
  const showModal = useCallback(() => {
    if (checkUserPreference()) {
      setIsModalOpen(true);
      setHasShown(true);
    }
  }, [checkUserPreference]);

  // Reset preferences (for testing or user request)
  const resetPreferences = useCallback(() => {
    localStorage.removeItem("newsletter_subscribed");
    localStorage.removeItem("newsletter_dismissed");
    localStorage.removeItem("newsletter_dismissed_time");
    setHasShown(false);
  }, []);

  return {
    isModalOpen,
    closeModal,
    showModal,
    enableScrollTrigger,
    enableExitIntentTrigger,
    showAfterDelay,
    resetPreferences,
    hasShown,
  };
}
