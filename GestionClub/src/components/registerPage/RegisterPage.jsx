import { useState } from 'react';
import StepOne from './StepOne';
import StepConfirm from './StepConfirm';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    phoneNumber: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1: 
        return (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepConfirm
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        )
      default:
        return <div>Error: Paso desconocido</div>;
    }
  };

  return (
    <div className='register-container'>
      {renderStep()}
    </div>
  );
};

export default RegisterPage