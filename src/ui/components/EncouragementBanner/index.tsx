import { useEffect, useState } from 'react';
import { EncouragementMessage } from '../../../core/entities/EncouragementMessage';
import { GetRandomEncouragementMessageUseCase } from '../../../core/usecases/get-random-encouragement-message.usecase';

// Props type
interface EncouragementBannerProps {
  getRandomMessageUseCase: GetRandomEncouragementMessageUseCase;
}

export const EncouragementBanner = ({
  getRandomMessageUseCase,
}: EncouragementBannerProps) => {
  const [message, setMessage] = useState<EncouragementMessage | null>(null);

  const loadRandomMessage = async () => {
    const newMessage = await getRandomMessageUseCase.execute();
    setMessage(newMessage);
  };

  useEffect(() => {
    loadRandomMessage();
  }, [getRandomMessageUseCase]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#f0f8ff] p-2 z-50 flex items-center justify-between">
      <span>{message.text}</span>
      <button
        onClick={loadRandomMessage}
        className="ml-2 bg-transparent border-none cursor-pointer text-xl"
        aria-label="Get another encouragement message"
      >
        &gt;&gt;&gt;
      </button>
    </div>
  );
};
