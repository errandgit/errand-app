const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// Mock service data
const mockServices = [
  {
    _id: '101',
    title: 'Professional House Cleaning',
    description: 'Complete house cleaning service including kitchen, bathrooms, bedrooms, and living areas. All supplies provided.',
    category: 'cleaning',
    subcategory: 'House Cleaning',
    provider: {
      _id: '2',
      firstName: 'Service',
      lastName: 'Provider',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 120,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.8,
      count: 24
    },
    isActive: true,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01')
  },
  {
    _id: '112',
    title: 'Furniture Assembly',
    description: 'Professional assembly of all types of furniture including IKEA, Wayfair, and other brands. Fast and reliable service.',
    category: 'home_improvement',
    subcategory: 'Furniture Assembly',
    provider: {
      _id: '10',
      firstName: 'Marcus',
      lastName: 'Bennett',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 55,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 36
    },
    isActive: true,
    createdAt: new Date('2024-06-13'),
    updatedAt: new Date('2024-06-13')
  },
  {
    _id: '113',
    title: 'TV & Picture Mounting',
    description: 'Professional mounting services for TVs, artwork, mirrors, and shelves. Includes all hardware and proper wall anchoring.',
    category: 'home_improvement',
    subcategory: 'Mounting',
    provider: {
      _id: '11',
      firstName: 'Jamal',
      lastName: 'Washington',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 75,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.7,
      count: 29
    },
    isActive: true,
    createdAt: new Date('2024-06-14'),
    updatedAt: new Date('2024-06-14')
  },
  {
    _id: '114',
    title: 'Heavy Lifting & Moving',
    description: 'Need help moving heavy items? We provide strong, reliable help for moving furniture, appliances, or other heavy objects within your home or to a new location.',
    category: 'moving',
    subcategory: 'Heavy Lifting',
    provider: {
      _id: '12',
      firstName: 'Daniel',
      lastName: 'Okafor',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 60,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.6,
      count: 18
    },
    isActive: true,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15')
  },
  {
    _id: '115',
    title: 'Holiday Decorating',
    description: 'Professional holiday decoration services including light installation, tree setup, and full interior/exterior decorating for any celebration or season.',
    category: 'home_improvement',
    subcategory: 'Holiday Decorating',
    provider: {
      _id: '13',
      firstName: 'Aisha',
      lastName: 'Mbeki',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 45,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.8,
      count: 22
    },
    isActive: true,
    createdAt: new Date('2024-06-16'),
    updatedAt: new Date('2024-06-16')
  },
  {
    _id: '116',
    title: 'Line Waiting Service',
    description: 'Need someone to wait in line for you? We provide professional line waiting services for event tickets, limited releases, government offices, and more.',
    category: 'errands',
    subcategory: 'Line Waiting',
    provider: {
      _id: '14',
      firstName: 'Kwame',
      lastName: 'Asante',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 30,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.7,
      count: 15
    },
    isActive: true,
    createdAt: new Date('2024-06-17'),
    updatedAt: new Date('2024-06-17')
  },
  {
    _id: '117',
    title: 'Smart Home Installation',
    description: 'Professional installation of smart home devices including thermostats, cameras, doorbells, speakers, and complete home automation systems.',
    category: 'tech',
    subcategory: 'Smart Home',
    provider: {
      _id: '15',
      firstName: 'Chidi',
      lastName: 'Ekwueme',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 90,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 33
    },
    isActive: true,
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-18')
  },
  {
    _id: '109',
    title: 'Grocery Shopping & Delivery',
    description: 'Personal grocery shopping service with careful selection of fresh produce and prompt delivery to your doorstep. Can shop at African specialty stores.',
    category: 'errands',
    subcategory: 'Shopping',
    provider: {
      _id: '7',
      firstName: 'Grace',
      lastName: 'Afolabi',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 25,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 27
    },
    isActive: true,
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-06-10')
  },
  {
    _id: '110',
    title: 'Package Pickup & Delivery',
    description: 'Reliable package collection and delivery service for busy individuals. We can collect parcels, mail, or documents and deliver them safely to your specified location.',
    category: 'errands',
    subcategory: 'Delivery',
    provider: {
      _id: '8',
      firstName: 'David',
      lastName: 'Mwangi',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 35,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.7,
      count: 19
    },
    isActive: true,
    createdAt: new Date('2024-06-11'),
    updatedAt: new Date('2024-06-11')
  },
  {
    _id: '111',
    title: 'Medication & Pharmacy Pickup',
    description: 'Convenient prescription medication pickup service from your local pharmacy. Perfect for elderly or those unable to leave home.',
    category: 'errands',
    subcategory: 'Healthcare',
    provider: {
      _id: '9',
      firstName: 'Imani',
      lastName: 'Johnson',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 30,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 31
    },
    isActive: true,
    createdAt: new Date('2024-06-12'),
    updatedAt: new Date('2024-06-12')
  },
  {
    _id: '102',
    title: 'Handyman Services',
    description: 'General repairs, fixture installations, furniture assembly, and more. Experienced and professional service.',
    category: 'home_improvement',
    subcategory: 'Handyman',
    provider: {
      _id: '2',
      firstName: 'Service',
      lastName: 'Provider',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 65,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.6,
      count: 18
    },
    isActive: true,
    createdAt: new Date('2024-06-02'),
    updatedAt: new Date('2024-06-02')
  },
  {
    _id: '103',
    title: 'Moving Assistance',
    description: 'Help with packing, loading, unloading, and furniture arrangement. Professional and careful handling of your belongings.',
    category: 'moving',
    subcategory: 'Local Moving',
    provider: {
      _id: '2',
      firstName: 'Service',
      lastName: 'Provider',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 75,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.7,
      count: 12
    },
    isActive: true,
    createdAt: new Date('2024-06-03'),
    updatedAt: new Date('2024-06-03')
  },
  {
    _id: '104',
    title: 'Traditional African Gardening',
    description: 'Expert garden services specializing in African vegetables and herbs. We help you grow traditional crops and medicinal plants from various African regions.',
    category: 'home_improvement',
    subcategory: 'Garden Design',
    provider: {
      _id: '3',
      firstName: 'Adama',
      lastName: 'Diallo',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 95,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 17
    },
    isActive: true,
    createdAt: new Date('2024-06-04'),
    updatedAt: new Date('2024-06-04')
  },
  {
    _id: '105',
    title: 'Computer Repair and IT Support',
    description: 'Technical support for computer issues, software installation, virus removal, and hardware repairs.',
    category: 'tech',
    subcategory: 'Computer Repair',
    provider: {
      _id: '2',
      firstName: 'Service',
      lastName: 'Provider',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 70,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 15
    },
    isActive: true,
    createdAt: new Date('2024-06-05'),
    updatedAt: new Date('2024-06-05')
  },
  {
    _id: '106',
    title: 'Professional Hair Braiding',
    description: 'Expert hair braiding services including box braids, cornrows, Senegalese twists, and more. Using authentic techniques from West and East Africa.',
    category: 'personal',
    subcategory: 'Hair Styling',
    provider: {
      _id: '4',
      firstName: 'Fatima',
      lastName: 'Nkosi',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 120,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.9,
      count: 32
    },
    isActive: true,
    createdAt: new Date('2024-06-06'),
    updatedAt: new Date('2024-06-06')
  },
  {
    _id: '107',
    title: 'African Cuisine Catering',
    description: 'Authentic catering services featuring dishes from various African countries. Perfect for events, parties, and cultural celebrations.',
    category: 'events',
    subcategory: 'Catering',
    provider: {
      _id: '5',
      firstName: 'Amara',
      lastName: 'Okafor',
      profileImage: ''
    },
    pricing: {
      type: 'fixed',
      amount: 25,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.8,
      count: 23
    },
    isActive: true,
    createdAt: new Date('2024-06-07'),
    updatedAt: new Date('2024-06-07')
  },
  {
    _id: '108',
    title: 'Traditional Clothing Alterations',
    description: 'Expert alterations and custom tailoring for traditional African attire. We specialize in fitting and modifying garments while preserving cultural authenticity.',
    category: 'personal',
    subcategory: 'Tailoring',
    provider: {
      _id: '6',
      firstName: 'Samuel',
      lastName: 'Mensah',
      profileImage: ''
    },
    pricing: {
      type: 'hourly',
      amount: 45,
      currency: 'USD'
    },
    images: [],
    rating: {
      average: 4.7,
      count: 18
    },
    isActive: true,
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-06-08')
  }
];

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res, next) => {
  try {
    const { category, limit = 10, page = 1, sort = 'createdAt' } = req.query;

    // Filter services by category if provided
    let filteredServices = [...mockServices];
    if (category) {
      filteredServices = filteredServices.filter(service => service.category === category);
    }

    // Sort services (simple implementation)
    if (sort === 'createdAt') {
      filteredServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'price') {
      filteredServices.sort((a, b) => a.pricing.amount - b.pricing.amount);
    } else if (sort === 'rating') {
      filteredServices.sort((a, b) => b.rating.average - a.rating.average);
    }

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    res.json({
      success: true,
      count: paginatedServices.length,
      pagination: {
        total: filteredServices.length,
        page: parseInt(page),
        pages: Math.ceil(filteredServices.length / parseInt(limit))
      },
      data: paginatedServices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res, next) => {
  try {
    const service = mockServices.find(service => service._id === req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Provider
exports.createService = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Add provider ID to request body
    req.body.provider = req.user.id;

    // Create service
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Provider
exports.updateService = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Update service
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Provider
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get provider services
// @route   GET /api/services/provider/services
// @access  Private/Provider
exports.getProviderServices = async (req, res, next) => {
  try {
    const services = await Service.find({ provider: req.user.id });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service availability
// @route   PUT /api/services/:id/availability
// @access  Private/Provider
exports.updateServiceAvailability = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    service.availability = req.body.availability;

    await service.save();

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service status
// @route   PUT /api/services/:id/status
// @access  Private/Provider
exports.updateServiceStatus = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    service.isActive = req.body.isActive;

    await service.save();

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search services
// @route   GET /api/services/search
// @access  Public
exports.searchServices = async (req, res, next) => {
  try {
    const { q, category, location, limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) query.category = category;
    
    // Location-based search (in a real app, would use geospatial query)
    if (location) {
      query['location.address.city'] = { $regex: location, $options: 'i' };
    }

    // Count total services based on query
    const total = await Service.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const services = await Service.find(query)
      .populate('provider', 'firstName lastName profileImage')
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      count: services.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
      { 
        id: 'home_improvement',
        name: 'Home Improvement',
        icon: '🏠',
        subcategories: [
          'Handyman',
          'Plumbing',
          'Electrical',
          'Carpentry',
          'Painting',
          'Garden Design',
          'African Gardening',
          'Furniture Assembly',
          'Mounting',
          'Holiday Decorating',
          'Home Repairs'
        ]
      },
      { 
        id: 'cleaning',
        name: 'Cleaning',
        icon: '✨',
        subcategories: [
          'House Cleaning',
          'Deep Cleaning',
          'Move-in/Move-out',
          'Commercial Cleaning'
        ]
      },
      { 
        id: 'moving',
        name: 'Moving',
        icon: '📦',
        subcategories: [
          'Local Moving',
          'Long Distance',
          'Furniture Assembly',
          'Junk Removal',
          'International Shipping',
          'Heavy Lifting',
          'Furniture Delivery',
          'Same-Day Delivery'
        ]
      },
      {
        id: 'errands',
        name: 'Errands',
        icon: '🛍️',
        subcategories: [
          'Shopping',
          'Delivery',
          'Healthcare',
          'Post Office',
          'Banking',
          'Government Offices',
          'Item Returns',
          'Line Waiting',
          'Personal Assistant',
          'Wait for Deliveries'
        ]
      },
      { 
        id: 'personal',
        name: 'Personal',
        icon: '👤',
        subcategories: [
          'Hair Styling',
          'Hair Braiding',
          'Personal Training',
          'Life Coaching',
          'Tutoring',
          'Tailoring'
        ]
      },
      { 
        id: 'tech',
        name: 'Tech',
        icon: '💻',
        subcategories: [
          'Computer Repair',
          'IT Support',
          'Smart Home Setup',
          'Data Recovery',
          'Money Transfer Services',
          'TV Mounting',
          'Home Theater Setup',
          'Printer Setup',
          'Device Troubleshooting',
          'Cable Management'
        ]
      },
      { 
        id: 'events',
        name: 'Events',
        icon: '🎉',
        subcategories: [
          'Photography',
          'Videography',
          'Catering',
          'African Cuisine',
          'Traditional Ceremonies',
          'Event Planning'
        ]
      },
      {
        id: 'cultural',
        name: 'Cultural',
        icon: '🌍',
        subcategories: [
          'Language Translation',
          'Cultural Consultation',
          'Immigration Services',
          'Document Preparation',
          'Community Integration'
        ]
      }
    ];

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};