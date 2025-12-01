import React, { useState } from 'react';
import "./AccordionRow.scss";
const AccordionRow = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("AccordionRow item:", isOpen, item);
  return (
    <div className="border-t border-gray-300 first:border-t-0 md:first:border-t py-6 md:py-10 transition-colors duration-300 hover:bg-gray-50/50">
      {/* 
         Grid Layout Strategy:
         Mobile: Stacked Flex with specific grouping
         Desktop: 12-column grid using display: contents to unwrap groups
         
         Desktop Cols:
         - Col 1: Number
         - Col 2-5: Title
         - Col 6-11: Content
         - Col 12: Icon
      */}
      <div 
        className="flex flex-col md:grid md:grid-cols-12 md:gap-x-6 cursor-pointer group items-start gap-y-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Number: Sits on top for mobile, Col 1 for Desktop */}
        <div className="text-3xl md:text-4xl text-gray-400 font-light md:col-span-1 md:row-start-1 group-hover:text-gray-600 transition-colors">
          {item.number}
        </div>

        {/* Title & Icon Wrapper 
            Mobile: Flex row to align Title and Icon side-by-side
            Desktop: 'contents' unwraps this div so children become direct grid items
        */}
        <div className="flex justify-between items-center w-full md:contents">
           {/* Title */}
           <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-black transition-colors md:col-span-4 md:row-start-1 self-center md:self-start">
            {item.title}
           </h2>

           {/* Icon */}
           <div className="md:col-span-1 md:col-start-12 md:row-start-1 md:flex md:justify-end md:pt-1">
             <button 
                className="w-8 h-8 flex items-center justify-center rounded-full border border-transparent group-hover:bg-gray-200 transition-all duration-300 focus:outline-none"
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                <span className="relative w-4 h-4 block">
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 transform -translate-y-1/2"></span>
                  <span 
                    className={`absolute top-0 left-1/2 h-full w-0.5 bg-slate-800 transform -translate-x-1/2 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                  ></span>
                </span>
              </button>
           </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-6 md:col-start-6 md:row-start-1 md:pt-1 mt-2 md:mt-0">
          <div className="text-lg md:text-xl text-slate-700 font-medium mb-2 md:mb-0">
            {item.subtitle}
          </div>
          <div className={`grid accordion-content ${isOpen ? 'open' : 'closed'}`}>
             <div className="accordion-inner min-h-0">
               <div className="pt-4 text-base md:text-lg text-slate-500 leading-relaxed max-w-prose">
                 {item.description}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionRow;