import { motion } from "framer-motion";
import teamPic from "../assets/teamPic.jpg";
import jecLogo from "../assets/jecLogo.jpg";

const AboutTeam = () => {
  return (
    <section className="py-8 px-4 bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto max-w-5xl"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            {/* Team Photo Section */}
            <div className="md:w-1/2 relative h-[400px] p-6">
              <span className="flex items-center gap-4 mb-2">
                <img
                  src={jecLogo}
                  alt="JEC Jabalpur"
                  className="w-10 h-10 object-contain"
                />
                <h1 className="text-3xl font-bold">Developer Team</h1>
              </span>
              <img
                src={teamPic}
                alt="Our Team"
                className="w-full h-full object-cover rounded-xl shadow-lg mb-4"
              />
            </div>

            {/* Team Details Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">Mentor:</h2>
              <p className="mb-2">Dr. Agya Mishra (agyamishra@gmail.com)</p>
              <p className="mb-6">
                Prof. and HOD Artificial Intelligence and Data Science (Jabalpur
                Engineering College, Jabalpur, Madhya Pradesh - 482011)
              </p>
              <h2 className="text-2xl font-bold mb-4">Members:</h2>
              <p className="mb-2">Abhay Bairagi (8th sem student of CSE)</p>
              <p className="mb-2">Abhinav Anand (8th sem student of CSE)</p>
              <p className="mb-2">Priyanshu Dayal (6th sem student of AI&DS)</p>
              <p className="mb-2">Yash Chourey (6th sem student of AI&DS)</p>
              <p className="mb-2">Dinkar Dubey (6th sem student of CSE)</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutTeam;
