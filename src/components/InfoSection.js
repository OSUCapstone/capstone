const InfoSection = ({ title, info, textClass = "3xl" }) => (
  <>
    <div className="text-gray-500 text-sm font-medium">{title}</div>
    <div className={`text-gray-800 text-${textClass} font-bold mb-2`}>
      {info}
    </div>
  </>
);

export default InfoSection;
