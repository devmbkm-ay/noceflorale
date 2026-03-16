'use client';

import { useRef } from 'react';
import Header from '@/components/header';
import Hero from '@/components/hero';
import EventDetails from '@/components/eventDetails';
import Gallery from '@/components/gallery';
import Location from '@/components/location';
import Footer from '@/components/footer';
import UserProfile from '@/components/auth/userProfile';
import { useAuth } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/scrollToTop';
import RsvpForm from '@/components/rsvp/RsvpForm';

export default function Home() {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Create a map of section IDs to their refs
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    home: heroRef,
    event: eventRef,
    rsvp: rsvpRef,
    gallery: galleryRef,
    location: locationRef,
    profile: profileRef,
  };

  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <Header sectionRefs={sectionRefs} />
      <main className="w-full">
        <div ref={heroRef} id="home">
          <Hero />
        </div>
        <div ref={eventRef} id="event">
          <EventDetails />
        </div>
        <div ref={galleryRef} id="gallery">
          <Gallery />
        </div>
        <div ref={rsvpRef} id="rsvp">
          <RsvpForm />
        </div>

        {/* Conditionally render either the RSVP form or user profile */}
        {user ? (
          <div ref={profileRef} id="profile">
            <UserProfile />
          </div>
        ) : (
          <div ref={locationRef} id="location">
            <Location />
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
