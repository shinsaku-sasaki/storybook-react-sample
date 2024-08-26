// 基本的なフォームを作成
import React, { useState } from 'react';

export interface FormProps {
    /**
     * フォームのタイトル
     */
    title: string;
    /**
     * フォームの説明
     */
    description: string;
    /**
     * フォームの送信ボタンのラベル
     */
    submitLabel: string;
    /**
     * フォームの送信時の処理
     */
    onSubmit: (value: string) => void;
}

/**
 * ユーザー入力を受け取るフォーム
 */
export const Form = ({
    title,
    description,
    submitLabel,
    onSubmit,
}: FormProps) => {
    const [value, setValue] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(value);
    };
    return (
        <form onSubmit={handleSubmit}>
            <h1>{title}</h1>
            <p>{description}</p>
            <input type="text" value={value} onChange={handleChange} />
            <button type="submit">{submitLabel}</button>
        </form>
    );
}