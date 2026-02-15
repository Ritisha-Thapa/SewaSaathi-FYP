import React, { useState } from 'react';
import Header from '../../components/customer/DashboardHeader';
import Footer from '../../components/customer/Footer';
import contactBg from '../../assets/images/services/plumbing.png'; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [faqOpen, setFaqOpen] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const faqs = [
    {
      question: 'How do I book a service?',
      answer: 'You can book a service by browsing our services page, selecting the service you need, and clicking "Book Now"...'
    },
    {
      question: 'How are service providers verified?',
      answer: 'All service providers on SewaSaathi undergo a thorough verification process including background checks...'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept eSewa, bank transfers, and cash on delivery (COD).'
    },
    {
      question: 'Can I cancel or reschedule?',
      answer: 'Yes, up to 24 hours before the scheduled service.'
    },
    {
      question: 'Not satisfied with service?',
      answer: 'Contact support within 48 hours for assistance or refund.'
    },
    {
      question: 'How do I become a provider?',
      answer: 'Click “Become a Provider” in the header and fill out the form.'
    }
  ];

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: ['support@sewasaathi.com', 'info@sewasaathi.com']
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: ['+977-1-1234567', '+977-9800000000']
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      details: ['Kathmandu, Nepal', 'Office Hours: 9 AM - 6 PM']
    }
  ];

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-white">
      <Header />

      {/* ---------------- HERO SECTION WITH BACKGROUND IMAGE ---------------- */}
      <section
        className="relative py-24 md:py-32 flex items-center"
        style={{
          backgroundImage: `url(${contactBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-[#1B3C53] opacity-70"></div>

        <div className="relative container mx-auto px-4 max-w-7xl text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            We’re always here to assist you. Connect with us anytime!
          </p>
        </div>
      </section>

      {/* ---------------- CONTACT FORM + INFO ---------------- */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* FORM */}
            <div>
              <h2 className="text-3xl font-bold text-[#1B3C53] mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1B3C53]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1B3C53]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1B3C53]"
                    placeholder="+977-9800000000"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1B3C53]"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#1B3C53] resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <button className="w-full py-3 bg-[#1B3C53] text-white rounded-lg font-semibold hover:bg-[#162f41] transition">
                  Send Message
                </button>
              </form>
            </div>

            {/* CONTACT INFO */}
            <div>
              <h2 className="text-3xl font-bold text-[#1B3C53] mb-6">Contact Information</h2>

              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#1B3C53] text-white p-3 rounded-lg">
                        {item.icon}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#1B3C53] mb-1">{item.title}</h3>
                        {item.details.map((detail, i) => (
                          <p key={i} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1B3C53] text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Support Hours</h3>
                <p className="flex justify-between"><span>Mon - Fri</span> <span>9 AM - 6 PM</span></p>
                <p className="flex justify-between"><span>Saturday</span> <span>10 AM - 4 PM</span></p>
                <p className="flex justify-between"><span>Sunday</span> <span>Closed</span></p>

                <p className="mt-4 text-sm text-gray-200">
                  For urgent matters: +977-9800000000
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#F9F5F0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-100"
                >
                  <span className="font-semibold text-[#1B3C53]">{faq.question}</span>

                  <svg
                    className={`w-5 h-5 transform transition ${faqOpen === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {faqOpen === index && (
                  <div className="px-6 py-4 text-gray-700 border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-gray-600">
            Have more questions? <span className="text-[#1B3C53] font-semibold">Contact us anytime.</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
