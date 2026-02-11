/**
 * FILE: src/components/PollPage.tsx
 * DESCRIPTION: 
 * Acts as the top-level route component for a specific poll.
 * Integrates with the existing QuestionDetail component and handles 404 logic.
 */

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import QuestionDetail from './QuestionDetail';

const PollPage: React.FC = () => {
  const { question_id } = useParams<{ question_id: string }>();
  
  // Access questions from the store to verify existence
  const questions = useAppSelector((state) => state.questions);
  
  // Guard: If the URL has an ID that doesn't exist in our data
  if (question_id && !questions[question_id]) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* We render the QuestionDetail component. 
          It will internally pull the question_id from the URL 
          using its own useParams() hook.
      */}
      <QuestionDetail />
    </div>
  );
};

export default PollPage;