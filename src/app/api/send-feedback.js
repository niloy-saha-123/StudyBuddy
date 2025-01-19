import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { feedback } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Using environment variable
        pass: process.env.EMAIL_PASS, // Using environment variable
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // Using environment variable
        to: ['niloysaha2404@gmail.com', 'kabbofaraz@gmail.com'], // Feedback recipients
        subject: 'StudyBuddy Feedback', // Fixed subject
        text: feedback, // User's feedback
      });

      res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send feedback' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
