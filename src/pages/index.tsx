import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import Seo from '@/components/Seo';

import Vercel from '~/svg/Vercel.svg';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='Home' />

      <main>
        <section>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <Vercel className='text-5xl' />
            <h1 className='mt-4'>Stock Predictor</h1>
            <p className='mt-2 text-sm text-gray-800'>
              A Semantic UI based stock prediction model based on Deep Learning
            </p>
            <p className='mt-2 text-sm text-gray-700'>
              <ArrowLink href='https://github.com/irfan7junior/stock-prediction'>
                UI and Server Repository
              </ArrowLink>
            </p>
            <p className='mt-2 text-sm text-gray-700'>
              <ArrowLink href='https://colab.research.google.com/drive/1fW2jG3CMc8MZWQNvhiB5QSQ2wnWQYVD1'>
                Deep Learning Colab Repository
              </ArrowLink>
            </p>

            <ButtonLink className='mt-6' href='/predictor' variant='light'>
              See all Predictions
            </ButtonLink>

            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='https://irfan7junior.in'>
                Irfan Keshav Anshuman Ankit
              </UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
