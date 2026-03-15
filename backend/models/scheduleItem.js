import mongoose from 'mongoose';

// Define the schema for schedule items
const scheduleItemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String 
  },
  location: { 
    type: String 
  },
  important: { 
    type: Boolean, 
    default: false 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
}, {
  timestamps: true
});

// Create and export the model
const ScheduleItem = mongoose.model('ScheduleItem', scheduleItemSchema);

export default ScheduleItem;

