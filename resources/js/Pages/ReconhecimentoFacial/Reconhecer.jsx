import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FaceRecognition from '@/Components/FaceReconigtion';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';


export default function Reconhecer({ auth, successMessage, errorMessage }) {
 


    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const onRecognitionSuccess = (faceImageDataURL) => {
        router.post('/enviar-dados', {
            imagem: faceImageDataURL
        });

 
        
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 4000);
      

      
      
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 4000);
        
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reconhecimento Facial</h2>}
        >
            <Head title="Reconhecedor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FaceRecognition width={640} height={480} onRecognitionSuccess={onRecognitionSuccess} />

                    {showSuccessMessage && successMessage && (
                        <div className="bg-green-200 text-green-800 py-2 px-4 rounded">
                            {successMessage}
                        </div>
                    )}

                    {showErrorMessage && errorMessage &&(
                        <div className="bg-red-200 text-red-800 py-2 px-4 rounded">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
