// ==UserScript==
// @name         Chinese Text Project 文本提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取ctext.org网站中的古籍文本
// @author       You
// @match        https://ctext.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function extractText() {
        const tdElements = document.querySelectorAll('td.ctext');
        const texts = [];
        
        tdElements.forEach(td => {
            if (td.getAttribute('style') === 'width: 60px;' && td.getAttribute('valign') === 'top') {
                return;
            }
            if (td.style.width === '60px' && td.vAlign === 'top') {
                return;
            }
            
            const text = td.textContent.trim();
            if (text) {
                texts.push(text);
            }
        });
        
        return texts;
    }

    function createButton(text, onClick, bgColor) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            padding: 10px 15px;
            background-color: ${bgColor};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '0.8';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '1';
        });
        return btn;
    }

    function showTextModal() {
        const texts = extractText();
        
        const existingModal = document.getElementById('ctext-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'ctext-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            width: 80%;
            max-width: 800px;
            max-height: 80%;
            overflow: auto;
            position: relative;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
        `;
        closeBtn.addEventListener('click', () => modal.remove());
        
        const title = document.createElement('h3');
        title.textContent = `提取的文本 (共 ${texts.length} 段)`;
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
        `;
        
        const textArea = document.createElement('textarea');
        textArea.value = texts.join('\n\n');
        textArea.style.cssText = `
            width: 100%;
            height: 400px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            font-size: 16px;
            line-height: 1.6;
            resize: vertical;
        `;
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(textArea);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function copyToClipboard() {
        const texts = extractText();
        const textToCopy = texts.join('\n\n');
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('已复制到剪贴板！共 ' + texts.length + ' 段文本');
        }).catch(err => {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('已复制到剪贴板！共 ' + texts.length + ' 段文本');
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    function init() {
        const viewBtn = createButton('查看文本', showTextModal, '#2196F3');
        viewBtn.style.top = '20px';
        
        const copyBtn = createButton('复制文本', copyToClipboard, '#4CAF50');
        copyBtn.style.top = '70px';
        
        document.body.appendChild(viewBtn);
        document.body.appendChild(copyBtn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
