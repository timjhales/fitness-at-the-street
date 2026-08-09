// Fallback content returned when the KV store has no saved data yet
// (fresh install, or before an admin has ever hit Save). Mirrors what
// used to be hardcoded directly in classes.html / index.html.

export const DEFAULT_CLASS_IMAGES = [
  { slotLabel: 'Circuit Training',           src: 'Images/classes/circuitclass.jpg',    alt: 'Circuit Training' },
  { slotLabel: 'Decades Reloaded',           src: 'Images/classes/reloadedclass.jpg',   alt: 'Decades Reloaded' },
  { slotLabel: 'Kettlebells',                src: 'Images/classes/kettleclass.jpg',     alt: 'Kettlebells' },
  { slotLabel: 'Yoga',                       src: 'Images/classes/yogaclass.jpg',       alt: 'Yoga' },
  { slotLabel: 'Powerhaus',                  src: 'Images/classes/powerhausclass.jpg',  alt: 'Powerhaus' },
  { slotLabel: 'Iron Giants Barbell Club',   src: 'Images/classes/irongiantsclass.jpg', alt: 'Iron Giants Barbell Club' },
  { slotLabel: 'HIIT',                       src: 'Images/classes/HIITCLASS.jpg',       alt: 'HIIT' },
  { slotLabel: 'Bar Attax',                  src: 'Images/classes/barclass.jpg',        alt: 'Bar Attax' },
  { slotLabel: 'Get A Grip',                 src: 'Images/classes/gripclass.jpg',       alt: 'Get A Grip' },
  { slotLabel: 'Bootcamp',                   src: 'Images/classes/bootcampclass.jpg',   alt: 'Bootcamp' },
];

export const DEFAULT_SCHEDULE = [
  { day: 'Monday',    time: '12:00', className: 'Pilates',                          instructor: 'Nikki' },
  { day: 'Monday',    time: '13:00', className: 'Gentle Circuits',                   instructor: '—' },
  { day: 'Monday',    time: '17:30', className: 'Circuit Training',                  instructor: '—' },
  { day: 'Monday',    time: '18:30', className: 'Circuit Training',                  instructor: '—' },
  { day: 'Monday',    time: 'Eve',   className: 'Decades Reloaded',                  instructor: '—' },

  { day: 'Tuesday',   time: '17:30', className: 'Fundamentals in Kettlebells',       instructor: '—' },
  { day: 'Tuesday',   time: '18:30', className: 'Kettlebell Burn',                   instructor: '—' },

  { day: 'Wednesday', time: '09:30', className: 'Yoga',                              instructor: 'Kim' },
  { day: 'Wednesday', time: '17:30', className: 'Powerhaus',                         instructor: '—' },
  { day: 'Wednesday', time: '18:30', className: 'Iron Giants Barbell Club',          instructor: '—' },
  { day: 'Wednesday', time: '19:30', className: 'Powerhaus',                         instructor: '—' },

  { day: 'Thursday',  time: '10:00', className: 'Gentle Fitness Lingwood',           instructor: '—' },
  { day: 'Thursday',  time: '17:30', className: 'HIIT',                              instructor: '—' },
  { day: 'Thursday',  time: '18:00', className: 'HIIT',                              instructor: '—' },
  { day: 'Thursday',  time: '18:30', className: 'Bar Attax',                         instructor: '—' },

  { day: 'Friday',    time: '09:30', className: 'Iron Giants Barbell Club',          instructor: '—' },
  { day: 'Friday',    time: '14:00', className: 'Get A Grip',                        instructor: '—' },
  { day: 'Friday',    time: '18:00', className: 'Iron Giants Barbell Club',          instructor: '—' },

  { day: 'Saturday',  time: '08:30', className: 'Bootcamp',                          instructor: 'Steve' },
];

const IG_LINK = 'https://www.instagram.com/fitness_at_the_street/';
const FB_LINK = 'https://www.facebook.com/fitnessatthestreet/';

export const DEFAULT_TILES = [
  { type: 'video', src: 'Images/transformation.mp4', link: IG_LINK, platform: 'instagram', alt: 'Transformation' },
  { type: 'image', src: 'Images/grip.jpg',            link: FB_LINK, platform: 'facebook',  alt: 'Training' },
  { type: 'image', src: 'Images/stevedaniel.jpg',     link: IG_LINK, platform: 'instagram', alt: 'Steve and Daniel' },
  { type: 'image', src: 'Images/samurai.jpg',         link: FB_LINK, platform: 'facebook',  alt: 'Training' },
  { type: 'video', src: 'Images/wdcevent.mp4',        link: IG_LINK, platform: 'instagram', alt: 'WDC Event' },
  { type: 'image', src: 'Images/worldwomenday.jpg',   link: FB_LINK, platform: 'facebook',  alt: 'World Women Day' },
  { type: 'image', src: 'Images/yarmouthhalf.jpg',    link: IG_LINK, platform: 'instagram', alt: 'Great Yarmouth Half Marathon' },
  { type: 'image', src: 'Images/social.jpg',          link: IG_LINK, platform: 'instagram', alt: 'Community' },
  { type: 'video', src: 'Images/daniel.mp4',          link: IG_LINK, platform: 'instagram', alt: 'Daniel' },
];
