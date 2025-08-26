import React from 'react';
import { Users, Award, TrendingUp, Zap } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Award, value: '40+', label: 'Products' },
    { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
    { icon: Zap, value: '24/7', label: 'Support' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-[#EBF5FF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-[#2A4365]" />
              </div>
              <div className="text-3xl font-bold text-[#2A4365] mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;