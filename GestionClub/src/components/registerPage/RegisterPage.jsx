import { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepConfirm from './StepConfirm';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    password: '',
    repeatPassword: '',
    userName: '',
    name: '',
    lastName: '',
    birthdate: '',
    locality: '',
    nationality: '',
    gender: '',
    phoneNumber: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const backStep = () => {
    setCurrentStep(prev => prev - 1);
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
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={backStep}
          />
        )
      case 3:
        return (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={backStep}
          />
        )
      case 4:
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