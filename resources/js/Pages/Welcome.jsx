import { Link, Head } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
 
  
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo</h1>
          <p className="text-gray-600 mb-8">Faça login para começar</p>
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Login
          </Link>
      </div>
  </div>
    );
}
