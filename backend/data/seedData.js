const seedData = {
  users: [
    {
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: '$2a$10$eDszBwX1VK4Qc8AhQXPZI.wj.KGT4jUXhkXAKtGYNuQmCUGbgU/HW', // 'password' hashed
      role: 'client',
      profileImage: 'https://via.placeholder.com/150',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      password: '$2a$10$eDszBwX1VK4Qc8AhQXPZI.wj.KGT4jUXhkXAKtGYNuQmCUGbgU/HW',
      role: 'provider',
      profileImage: 'https://via.placeholder.com/150',
      bio: 'Professional cleaner with 5 years of experience',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike@example.com',
      password: '$2a$10$eDszBwX1VK4Qc8AhQXPZI.wj.KGT4jUXhkXAKtGYNuQmCUGbgU/HW',
      role: 'provider',
      profileImage: 'https://via.placeholder.com/150',
      bio: 'Home repair specialist with 10 years experience',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  services: [
    {
      title: 'Professional Home Cleaning',
      description: 'Thorough cleaning of your home including kitchen, bathrooms, and living areas.',
      category: 'cleaning',
      subcategory: 'House Cleaning',
      provider: null, // Will be updated after users are inserted
      pricing: {
        type: 'hourly',
        amount: 25,
        currency: 'USD'
      },
      images: ['https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Home+Cleaning'],
      rating: {
        average: 4.9,
        count: 124
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Furniture Assembly',
      description: 'Professional assembly of all types of furniture including IKEA and other brands.',
      category: 'home_improvement',
      subcategory: 'Furniture Assembly',
      provider: null, // Will be updated after users are inserted
      pricing: {
        type: 'fixed',
        amount: 60,
        currency: 'USD'
      },
      images: ['https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Furniture+Assembly'],
      rating: {
        average: 4.8,
        count: 89
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Hair Braiding',
      description: 'Professional hair braiding services for all hair types.',
      category: 'personal',
      subcategory: 'Hair Braiding',
      provider: null, // Will be updated after users are inserted
      pricing: {
        type: 'fixed',
        amount: 120,
        currency: 'USD'
      },
      images: ['https://via.placeholder.com/300x200/FF4081/FFFFFF?text=Hair+Braiding'],
      rating: {
        average: 5.0,
        count: 56
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Moving Assistance',
      description: 'Help with moving, loading, and unloading your belongings.',
      category: 'moving',
      subcategory: 'Local Moving',
      provider: null, // Will be updated after users are inserted
      pricing: {
        type: 'hourly',
        amount: 40,
        currency: 'USD'
      },
      images: ['https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Moving+Services'],
      rating: {
        average: 4.7,
        count: 67
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'African Cuisine Catering',
      description: 'Authentic African cuisine for events and gatherings.',
      category: 'events',
      subcategory: 'African Cuisine',
      provider: null, // Will be updated after users are inserted
      pricing: {
        type: 'fixed',
        amount: 100,
        currency: 'USD'
      },
      images: ['https://via.placeholder.com/300x200/FFC107/FFFFFF?text=African+Cuisine'],
      rating: {
        average: 4.9,
        count: 38
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  bookings: [
    {
      service: null, // Will be updated after services are inserted
      client: null, // Will be updated after users are inserted
      provider: null, // Will be updated after users are inserted
      status: 'completed',
      scheduledDate: new Date(2025, 5, 15),
      scheduledTime: {
        startTime: '10:00',
        endTime: '13:00'
      },
      price: {
        amount: 75,
        currency: 'USD'
      },
      createdAt: new Date(2025, 5, 10),
      updatedAt: new Date(2025, 5, 15)
    },
    {
      service: null, // Will be updated after services are inserted
      client: null, // Will be updated after users are inserted
      provider: null, // Will be updated after users are inserted
      status: 'scheduled',
      scheduledDate: new Date(2025, 6, 30),
      scheduledTime: {
        startTime: '14:00',
        endTime: '16:00'
      },
      price: {
        amount: 60,
        currency: 'USD'
      },
      createdAt: new Date(2025, 6, 25),
      updatedAt: new Date(2025, 6, 25)
    }
  ],
  reviews: [
    {
      service: null, // Will be updated after services are inserted
      booking: null, // Will be updated after bookings are inserted
      reviewer: null, // Will be updated after users are inserted
      provider: null, // Will be updated after users are inserted
      rating: 5,
      comment: 'Sarah did an amazing job cleaning my apartment. Very thorough and professional.',
      createdAt: new Date(2025, 5, 16),
      updatedAt: new Date(2025, 5, 16)
    }
  ]
};

module.exports = seedData;