"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DiseaseDetailsPage() {
  const params = useParams();
  const diseaseId = params.diseaseId as string;
  
  return (
    <div>
      This is the disease id : {diseaseId}
    </div>
  );
}