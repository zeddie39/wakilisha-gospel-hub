import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Star, Music, Crown, Heart } from 'lucide-react';

const TeamMembers = () => {
  console.log('Supabase client:', supabase);

  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      console.log('TeamMembers queryFn called');
      
      // Use Supabase client instead of direct fetch
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Supabase data:', data);
      return data;
    }
  });

  // Debug log
  console.log('teamMembers', teamMembers, 'isLoading', isLoading, 'error', error);

  const getIcon = (position: string) => {
    if (position.includes('CEO') || position.includes('Founder')) return <Crown className="h-6 w-6 text-gospel-gold" aria-label="CEO or Founder" />;
    if (position.includes('Director')) return <Music className="h-6 w-6 text-gospel-gold" aria-label="Director" />;
    if (position.includes('Chair')) return <Star className="h-6 w-6 text-gospel-gold" aria-label="Chair" />;
    if (position.includes('Patron')) return <Crown className="h-6 w-6 text-gospel-gold" aria-label="Patron" />;
    return <Heart className="h-6 w-6 text-gospel-gold" aria-label="Team Member" />;
  };

  // Hardcoded image map for local images
  const imageMap: Record<string, string> = {
    "Rodgers Makheti": "/rodgers.jpg",
    "Vincent Zedekiah": "/zeddie.jpg",
    // Add more mappings: "Name": "/team/filename.jpg"
  };

  const renderImage = (member: { name: string; image_url?: string }) => {
    const imageSrc = member.image_url || imageMap[member.name];
    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt={`Photo of ${member.name}`}
          className="h-56 w-56 object-cover rounded-full border-4 border-gospel-gold mb-2 transition-transform duration-300 hover:scale-[2.5] hover:z-30 shadow-2xl"
          style={{ objectPosition: "center top" }}
        />
      );
    }
    return (
      <div
        className="h-56 w-56 flex items-center justify-center rounded-full bg-gray-200 border-4 border-gospel-gold mb-2 transition-transform duration-300 hover:scale-[2.5] hover:z-30 shadow-2xl"
        aria-label="Placeholder for team member photo"
      >
        <Users className="h-20 w-20 text-gospel-gold" />
      </div>
    );
  };

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600" role="alert">Error loading team members: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600" role="status">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gospel-navy mb-6">Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated servants leading Wakilisha Gospel Band in ministry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers?.map((member) => (
            <Card
              key={member.id}
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6 flex flex-col items-center">
                  {renderImage(member)}
                  {getIcon(member.position)}
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-2">{member.name}</h3>
                <p className="text-gospel-gold font-medium mb-4">{member.position}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
