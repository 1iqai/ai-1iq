
interface SquareQProps {
  children: string;
}

const SquareQ = ({ children }: SquareQProps) => {
  // First handle the special case of "1iQ" - preserve it as is
  // Then replace all remaining capital O with regular O and wrap O in spans for styling
  const processedText = children
    .replace(/1i[QO]/g, '1iQ') // Handle "1iQ" or "1iO" variations
    .replace(/O/g, 'O')
    .replace(/(?<!1i)O/g, '<span class="square-q">O</span>'); // Only wrap O that's not part of "1iQ"
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: processedText }}
      className="square-q-container"
    />
  );
};

export default SquareQ;
