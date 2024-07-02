const Loader = ({ content }: { content: string }) => {
  return (
    <div className="paragraph-1-medium m-20 flex animate-pulse justify-center text-dark-700 dark:text-white-200">
      <h1>Loading {content}...</h1>
    </div>
  );
};

export default Loader;
