import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (text: string) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
}) => {
  const { languageCode, currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Sample phrases depending on active language
  const samplePrompts: Record<string, string> = {
    hi: 'मुझे कॉलेज की फीस के लिए आर्थिक सहायता और छात्रवृत्ति चाहिए।',
    en: 'I need an income certificate for my college scholarship application.',
    bn: 'কলেজের বৃত্তির জন্য আমার আয়ের শংসাপত্র দরকার।',
    te: 'నా కాలేజ్ స్కాలర్షిప్ కోసం ఆదాయ ధృవీకరణ పత్రం కావాలి.',
    mr: 'मला कॉलेज स्कॉलरशिपसाठी उत्पन्नाचा दाखला हवा आहे.',
    ta: 'கல்லூரி கல்வி உதவித்தொகைக்கு வருமானச் சான்றிதழ் தேவை.',
    gu: 'મને કૉલેજ શિષ્યવૃત્તિ માટે આવકનું પ્રમાણપત્ર જોઈએ છે.',
  };

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setIsListening(true);
      setTranscript('');
      // Simulate speech recognition or use Web Speech API if supported
      const chosenSample =
        samplePrompts[languageCode] ||
        samplePrompts['hi'] ||
        'I need financial help for my higher education tuition fees.';

      timer = setTimeout(() => {
        setTranscript(chosenSample);
        setIsListening(false);
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [isOpen, languageCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Voice Input • {currentLanguage.nameEn} ({currentLanguage.nativeName})
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mic Pulse Animation */}
        <div className="relative my-6 flex items-center justify-center">
          {isListening && (
            <div className="absolute w-24 h-24 rounded-full bg-blue-100 animate-ping opacity-75"></div>
          )}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition ${
              isListening ? 'bg-blue-900 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isListening ? (
              <Mic className="w-9 h-9 animate-pulse" />
            ) : (
              <Check className="w-9 h-9" />
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900">
          {isListening ? 'Listening to your voice...' : 'Speech Captured!'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Speak in any Indian language. CivicAssist will match relevant government schemes.
        </p>

        {/* Live Transcript Box */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left min-h-[70px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Transcribed Query:
          </span>
          <p className="text-sm font-medium text-slate-800">
            {transcript || (
              <span className="text-slate-400 italic">Listening for speech input...</span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              setIsListening(true);
              setTranscript('');
              setTimeout(() => {
                setTranscript(
                  samplePrompts[languageCode] ||
                    'मुझे कॉलेज स्कॉलरशिप के लिए आय प्रमाण पत्र चाहिए।'
                );
                setIsListening(false);
              }, 1800);
            }}
            className="flex-1 py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Speak Again
          </button>
          <button
            disabled={!transcript}
            onClick={() => {
              if (transcript) {
                onTranscriptReady(transcript);
                onClose();
              }
            }}
            className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Search Service</span>
          </button>
        </div>
      </div>
    </div>
  );
};
