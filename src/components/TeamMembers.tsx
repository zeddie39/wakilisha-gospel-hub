
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Star, Music, Crown, Heart } from 'lucide-react';

const TeamMembers = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const getIcon = (position: string) => {
    if (position.includes('CEO') || position.includes('Founder')) return <Crown className="h-6 w-6 text-gospel-gold" />;
    if (position.includes('Director')) return <Music className="h-6 w-6 text-gospel-gold" />;
    if (position.includes('Chair')) return <Star className="h-6 w-6 text-gospel-gold" />;
    if (position.includes('Patron')) return <Crown className="h-6 w-6 text-gospel-gold" />;
    return <Heart className="h-6 w-6 text-gospel-gold" />;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading team members...</p>
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
          {teamMembers?.map((member, index) => (
            <Card key={member.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6">
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
