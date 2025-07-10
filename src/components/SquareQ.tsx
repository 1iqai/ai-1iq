
interface SquareQProps {
  children: string;
}

const SquareQ = ({ children }: SquareQProps) => {
  // First preserve "1iQ" as is, then replace all other square symbols with "O" and wrap them for styling
  const processedText = children
    .replace(/1i[QO]/g, '1iQ') // Handle "1iQ" or "1iO" variations - preserve as 1iQ
    .replace(/(?<!1i)[QO]/g, '<span class="square-q">O</span>'); // Replace all other Q/O with styled O, but not the Q in "1iQ"
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: processedText }}
      className="square-q-container"
    />
  );
};

export default SquareQ;
