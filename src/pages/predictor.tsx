import axios from 'axios';
import clsx from 'clsx';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import Charts from '@/components/Charts';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';

type Stock = typeof stockList[number];

export default function ComponentsPage() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('light');
  const [stock, setStock] = React.useState<Stock>('britannia');
  const [isRenderGraph, setIsRenderGraph] = React.useState(false);
  const [OriginalDataUrl, setOriginalDataUrl] = React.useState('');
  const [
    ValidationAndFuturePredictionUrl,
    setValidationAndFuturePredictionUrl,
  ] = React.useState('');
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [emailButtonText, setEmailButtonText] =
    React.useState<string>('Register Email');
  const [isSendMailLoading, setIsSendMailLoading] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState(
    'You can select any stock from the given dropdown and render the prediction graph.'
  );
  function toggleMode() {
    return mode === 'dark' ? setMode('light') : setMode('dark');
  }

  const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-600';

  const renderGraph = async () => {
    setIsRegistered(false);
    setEmailButtonText('Register Email');
    setIsLoading(true);
    const response = await axios.get('/api/stockpredictor', {
      params: {
        stock_name: stock,
      },
    });
    if (response.status !== 200) {
      setText('Something Went Wrong. Please Reach out the Developers');
      setIsLoading(false);
    }

    setOriginalDataUrl(response.data.original_data_url);
    setValidationAndFuturePredictionUrl(
      response.data.validation_and_future_prediction_url
    );

    setIsLoading(false);
    setIsRenderGraph(true);
  };

  const sendEmail = async (email: string) => {
    setIsSendMailLoading(true);

    const response = await axios.get('/api/sendmail', {
      params: {
        email,
      },
    });

    if (response.status === 200) {
      setEmailButtonText('Email Sent');
      setIsRegistered(true);
    } else {
      setText('Something Went Wrong. Please Reach out the Developers');
    }
    if (emailRef.current) {
      emailRef.current.value = '';
    }
    setIsSendMailLoading(false);
  };

  return (
    <Layout>
      <Seo
        templateTitle='Components'
        description='Pre-built components with awesome default'
      />

      <main>
        <section className={clsx(mode === 'dark' ? 'bg-dark' : 'bg-gray-50')}>
          <div
            className={clsx(
              'layout min-h-screen py-20',
              mode === 'dark' ? 'text-white' : 'text-black'
            )}
          >
            <h1>List of Stocks</h1>
            <ArrowLink direction='left' className='mt-2' href='/'>
              Back to Home
            </ArrowLink>

            <div className='mt-8 flex flex-wrap gap-2'>
              <Button
                onClick={toggleMode}
                variant={mode === 'dark' ? 'light' : 'dark'}
              >
                Set to {mode === 'dark' ? 'light' : 'dark'}
              </Button>
            </div>

            <ol className='mt-8 space-y-6'>
              <li className='flex flex-col items-center justify-center space-y-2'>
                <h2 className='text-lg md:text-xl'>Stocks Dropdown</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>{text}</p>
                <div className='flex flex-wrap gap-2'>
                  <select
                    name='color'
                    id='color'
                    value={stock}
                    className={clsx(
                      'block max-w-xs rounded',
                      mode === 'dark'
                        ? 'border border-gray-600 bg-dark'
                        : 'border-gray-300 bg-white',
                      'focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-400'
                    )}
                    onChange={(e) => setStock(e.target.value as Stock)}
                  >
                    {stockList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Button
                    isLoading={isLoading}
                    onClick={renderGraph}
                    variant='outline'
                    style={{ display: isRenderGraph ? 'none' : 'block' }}
                  >
                    Render Graph
                  </Button>
                  {isRenderGraph && (
                    <Button
                      onClick={() => setIsRenderGraph(false)}
                      variant='primary'
                    >
                      Reset Graph
                    </Button>
                  )}
                </div>
                <div
                  style={{ display: isRenderGraph ? 'block' : 'none' }}
                  className='flex flex-wrap gap-1'
                >
                  <input type='text' className='mr-2' ref={emailRef} />
                  <Button
                    disabled={isRegistered ? true : false}
                    onClick={() => sendEmail(emailRef.current?.value as string)}
                    variant='outline'
                    isLoading={isSendMailLoading}
                  >
                    {emailButtonText}
                  </Button>
                </div>
              </li>
            </ol>
            {isRenderGraph && (
              <Charts
                OriginalDataUrl={OriginalDataUrl}
                ValidationAndFuturePredictionUrl={
                  ValidationAndFuturePredictionUrl
                }
              />
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}

const stockList = ['britannia'] as const;
