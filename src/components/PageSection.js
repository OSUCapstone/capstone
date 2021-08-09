const PageSection = ({ title, children }) => (
  <div className="mb-3">
    <p className="text-gray-500 text-xs font-medium italic mb-2">{title}</p>
    <div className="w-full rounded-md border border-gray-300 p-3">
      {children}
    </div>
  </div>
);

export default PageSection;
