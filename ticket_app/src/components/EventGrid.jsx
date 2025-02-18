import TiltedCard from "./TiledCard";

const events = [
  {
    id: 1,
    title: "Zakir Khan Stand-Up Comedy",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=500&h=400&fit=crop",
    date: "Apr 15, 2024"
  },
  {
    id: 2,
    title: "Arijit Singh Live Concert",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=400&fit=crop",
    date: "Apr 20, 2024"
  },
  {
    id: 3,
    title: "Brahmastra Movie Premiere",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=400&fit=crop",
    date: "Apr 25, 2024"
  },
  {
    id: 4,
    title: "Vir Das Comedy Tour",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=400&fit=crop",
    date: "May 1, 2024"
  },
  {
    id: 5,
    title: "Divine Rap Concert",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=500&h=400&fit=crop",
    date: "May 5, 2024"
  },
  {
    id: 6,
    title: "Sunburn Music Festival",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&h=400&fit=crop",
    date: "May 10, 2024"
  }
];

export default function EventGrid() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col">
              <TiltedCard
                imageSrc={event.image}
                altText={event.title}
                captionText={`${event.title} - ${event.date}`}
                containerHeight="300px"
                containerWidth="100%"
                imageHeight="300px"
                imageWidth="100%"
                scaleOnHover={1.05}
                rotateAmplitude={10}
                showMobileWarning={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-4 bg-black/50 rounded-[15px] flex flex-col justify-end">
                    <h3 className="text-white font-bold text-xl mb-2">{event.title}</h3>
                    <p className="text-white/80">{event.date}</p>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}