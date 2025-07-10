
interface SquareQProps {
  children: string;
}

const SquareQ = ({ children }: SquareQProps) => {
  // Replace all capital O with Q and wrap Q in spans for styling
  const processedText = children.replace(/O/g, 'Q').replace(/Q/g, '<span class="square-q">Q</span>');
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: processedText }}
      className="square-q-container"
    />
  );
};

export default SquareQ;
