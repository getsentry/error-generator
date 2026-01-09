'use client';

import { motion } from 'framer-motion';
import { floatingAnimation, rotatingAnimation, bobbingAnimation } from '@/app/styles/animations';

export const GeometricDecorations = () => (
    <>
        <motion.div
            className="absolute top-[2%] left-[-2%] w-0 h-0 opacity-40
                 border-l-[100px] border-l-transparent
                 border-r-[100px] border-r-transparent
                 border-b-[150px] border-b-hero-purple"
            variants={rotatingAnimation}
            animate="animate"
        />

        <motion.div
            className="absolute top-[8%] right-[5%] w-32 h-32 bg-hero-coral opacity-30"
            variants={bobbingAnimation}
            animate="animate"
        />

        <motion.div
            className="absolute top-[55%] left-[-3%] w-40 h-40 border-[8px] border-hero-gold opacity-25 rounded-full"
            variants={floatingAnimation}
            animate="animate"
        />

        <motion.div
            className="absolute bottom-[12%] right-[3%] w-48 h-48 border-[8px] border-hero-lavender opacity-20"
            variants={bobbingAnimation}
            animate="animate"
            style={{ animationDelay: '2s' }}
        />

        <motion.div
            className="absolute top-[55%] right-[6%] w-20 h-20 bg-hero-peach opacity-35 rotate-45"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: '1s' }}
        />

        <motion.div
            className="absolute bottom-[8%] left-[22%] w-0 h-0 opacity-30
                 border-l-[50px] border-l-transparent
                 border-r-[50px] border-r-transparent
                 border-t-[80px] border-t-hero-coral"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: '0.5s' }}
        />

        <motion.div
            className="absolute top-[12%] left-[45%] w-24 h-24 border-[6px] border-hero-purple opacity-25 rounded-full"
            variants={bobbingAnimation}
            animate="animate"
            style={{ animationDelay: '1.5s' }}
        />

        <motion.div
            className="absolute top-[82%] left-[-1%] w-14 h-14 bg-hero-violet opacity-30 rotate-45"
            variants={bobbingAnimation}
            animate="animate"
            style={{ animationDelay: '2.5s' }}
        />

        <div className="absolute bottom-[12%] left-0 w-[20%] h-2 bg-hero-coral opacity-50" />
        <div className="absolute top-[22%] right-0 w-[18%] h-2 bg-hero-purple opacity-50" />
        <div className="absolute bottom-[8%] right-[20%] w-[15%] h-1.5 bg-hero-gold opacity-40" />

        <div className="absolute bottom-[3%] left-[1%] flex gap-3 opacity-60">
            <div className="w-5 h-5 bg-hero-purple" />
            <div className="w-5 h-5 bg-hero-coral" />
            <div className="w-5 h-5 bg-hero-gold" />
        </div>

        <div className="absolute top-[18%] right-[12%] flex gap-2 opacity-50">
            <div className="w-4 h-4 bg-hero-lavender" />
            <div className="w-4 h-4 bg-hero-peach" />
            <div className="w-4 h-4 bg-hero-violet" />
        </div>

        <motion.div
            className="absolute top-[35%] left-[1%] flex flex-col gap-2 opacity-45"
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: '3s' }}
        >
            <div className="w-3 h-3 bg-hero-coral" />
            <div className="w-3 h-3 bg-hero-purple" />
            <div className="w-3 h-3 bg-hero-gold" />
        </motion.div>

        <div className="absolute bottom-[18%] right-[8%] flex gap-2 opacity-55">
            <div className="w-4 h-4 bg-hero-gold" />
            <div className="w-4 h-4 bg-hero-purple" />
            <div className="w-4 h-4 bg-hero-coral" />
        </div>

        <motion.div
            className="absolute top-[38%] right-[2%] flex flex-col gap-1 opacity-40"
            variants={bobbingAnimation}
            animate="animate"
            style={{ animationDelay: '1s' }}
        >
            <div className="w-6 h-6 bg-hero-purple" />
            <div className="w-6 h-6 bg-hero-peach" />
            <div className="w-6 h-6 bg-hero-lavender" />
        </motion.div>
    </>
);
