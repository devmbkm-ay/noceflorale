import ScheduleItem from '../models/scheduleItem.js';

// Sample schedule items for the wedding day
const scheduleItems = [
  {
    title: "Wedding Ceremony",
    description: "The blessing ceremony will take place in the garden area",
    startTime: "14:00",
    endTime: "15:00",
    location: "Garden Area",
    important: true,
    order: 1
  },
  {
    title: "Welcome Drinks & Photos",
    description: "Enjoy welcome drinks while photos are being taken",
    startTime: "15:00",
    endTime: "16:30",
    location: "Patio",
    important: false,
    order: 2
  },
  {
    title: "Dinner",
    description: "A three-course meal will be served",
    startTime: "17:00",
    endTime: "19:00",
    location: "Main Hall",
    important: true,
    order: 3
  },
  {
    title: "Speeches",
    description: "Toasts and speeches from the wedding party",
    startTime: "19:00",
    endTime: "19:45",
    location: "Main Hall",
    important: true,
    order: 4
  },
  {
    title: "First Dance",
    description: "The couple's first dance",
    startTime: "20:00",
    endTime: "20:15",
    location: "Dance Floor",
    important: true,
    order: 5
  },
  {
    title: "Evening Party",
    description: "Dancing and celebrations continue",
    startTime: "20:15",
    endTime: "00:00",
    location: "Dance Floor",
    important: false,
    order: 6
  }
];

// Function to seed the database with sample schedule items
export const seedScheduleItems = async () => {
  try {
    // Check if there are already schedule items
    const count = await ScheduleItem.countDocuments();
    
    if (count === 0) {
      console.log('🗓️ No schedule items found, seeding database...');
      
      // Insert all sample schedule items
      await ScheduleItem.insertMany(scheduleItems);
      
      console.log(`✅ Successfully seeded ${scheduleItems.length} schedule items!`);
    } else {
      console.log(`🗓️ Database already has ${count} schedule items, skipping seed.`);
    }
  } catch (error) {
    console.error('❌ Error seeding schedule items:', error);
  }
};

