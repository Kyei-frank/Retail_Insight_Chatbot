import React from 'react';
import billImage from '../assets/bill.jpg';

function Billing() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 p-4">
        <img src={billImage} alt="Billing illustration" className="w-full h-auto" />
      </div>
      <div className="md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Billing</h2>
        <p className="mb-4">Manage your subscriptions and payments.</p>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          <p className="font-bold">Important Notice</p>
          <p>
            We have built an agent that queries our Noodle database for information based on your requests. 
            When you ask a question, the answer includes the associated cost and token usage. 
            However, please note that the actual billing functionality has not yet been implemented.
          </p>
        </div>
        <p className="mb-4">
          We're excited to inform you that we are actively working on integrating a comprehensive 
          billing system. This feature is a top priority for our development team, and we plan to 
          roll it out in the near future.
        </p>
        <p className="mb-4">
          In the meantime, we invite you to enjoy our NoodifyGPT service free of charge. This 
          complimentary access period allows you to explore the full capabilities of our service 
          without any financial commitment.
        </p>
        <p>
          We appreciate your patience and support as we work towards enhancing your experience 
          with NoodifyGPT. Stay tuned for updates on the billing feature!
        </p>
      </div>
    </div>
  );
}

export default Billing;