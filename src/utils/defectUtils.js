const defectTypes = [
  'Crack', 'Corrosion', 'Misalignment', 'Wear', 
  'Ballast Issue', 'Sleeper Damage', 'Joint Defect'
];

const locations = [
  'KM 245+300', 'KM 245+450', 'KM 246+100', 
  'KM 246+500', 'KM 247+000', 'KM 247+200'
];

export const generateDefects = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: defectTypes[Math.floor(Math.random() * defectTypes.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
    timestamp: `${Math.floor(Math.random() * 60)} min ago`,
    confidence: `${Math.floor(Math.random() * 30) + 70}%`,
    camera: Math.random() > 0.5 ? 'left' : 'right'
  }));
};