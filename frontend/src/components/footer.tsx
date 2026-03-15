/**
 * Footer component for the application
 * 
 * Renders a responsive footer with contact and location links, 
 * styled with Tailwind CSS and Framer Motion animations.
 * 
 * @param {Object} props - Component properties
 * @param {string} [props.className] - Optional additional CSS classes to apply to the footer
 * @returns {React.ReactElement} Footer component with animated links and responsive design
 */// import { cn } from '@/lib/utils';
// import { motion } from 'framer-motion';

// interface FooterProps {
//   className?: string;
// }

// const Footer = ({ className }: FooterProps) => {
//   return (
//     <footer className={cn("py-12 px-4 bg-royal-900 text-white relative overflow-hidden", className)}>
//       <div className="container mx-auto max-w-7xl">
//         <motion.div 
//           className="flex flex-col items-center"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8" />
          
//           <h3 className="text-2xl md:text-3xl font-playfair italic text-gold-400 mb-6">
//             We hope to see you there
//           </h3>
          
//           <p className="text-royal-100 text-lg mb-8">
//             Please respond by <span className="text-gold-300 font-medium">June 1st, 2024</span>
//           </p>
          
//           <div className="flex flex-wrap justify-center gap-6 mb-8">
//             <motion.a 
//               href="#contact"
//               className="text-gold-400 hover:text-gold-300 transition-colors duration-300 text-lg"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Contact Us
//             </motion.a>
//             <motion.a 
//               href="#location"
//               className="text-gold-400 hover:text-gold-300 transition-colors duration-300 text-lg"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Directions
//             </motion.a>
//             <motion.a 
//               href="#accommodations"
//               className="text-gold-400 hover:text-gold-300 transition-colors duration-300 text-lg"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Accommodations
//             </motion.a>
//           </div>
          
//           <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8" />
          
//           <p className="text-royal-300 text-sm">
//             © {new Date().getFullYear()} Marie-Nella & Sidney. All rights reserved.
//           </p>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



export default function Footer() {
    return (
        <footer className="py-6 bg-gray-800 text-gray-200">
            <div className="max-w-4xl mx-auto text-center">
                <p>&copy; 2025 Noce Florale. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="hover:text-white">Facebook</a>
                    <a href="#" className="hover:text-white">Instagram</a>
                    <a href="#" className="hover:text-white">Twitter</a>
                </div>
            </div>
        </footer>
    );
}