import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, dark, dracula, gruvboxDark, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MessageMarkdown = ({ content }) => {

     const handleCopy = async (message) => {
        try {
            await navigator.clipboard.writeText(message);
            alert("Copied to clipboard!");
        } catch (err) {
            alert("Failed to copy!");
            console.error(err);
        }
    };


    return (
        <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match && match[1] ? match[1] : 'text';
          const { node: _, inline: __, ...otherProps } = props; // Filter out irrelevant props

          return !inline && match ? (
            <div className="bg-[#000] rounded-xl pb-2">
              <div className="flex justify-between items-center px-3 pt-2">
                <p className="text-sm">{language}</p>
                <div className="flex gap-3">
                  <div
                    onClick={() => handleCopy(children)}
                    className="flex text-xs gap-1 items-center hover:bg-[#2f2f2f] cursor-pointer p-1 rounded-lg"
                  >
                    <button aria-label="Copy code">[Copy Icon]</button>
                    <p>Copy</p>
                  </div>
                  <div
                    onClick={() => console.log('Edit functionality TBD')}
                    className="flex text-xs gap-1 items-center hover:bg-[#2f2f2f] cursor-pointer p-1 rounded-lg"
                  >
                    <button aria-label="Edit code">[Edit Icon]</button>
                    <p>Edit</p>
                  </div>
                </div>
              </div>
              <SyntaxHighlighter
                style={{ ...atomDark, backgroundColor: '#000000' }}
                language={language}
                PreTag="div"
                className="custom-syntax-highlight"
                {...otherProps}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div >
          ) : (
            <code className="bg-[#2f2f2f] text-green-400 px-1 py-0.5 rounded">
              {children}
            </code>
          );
        },
        img({ node, ...props }) {
          return <img {...props} className="my-4 max-w-full rounded-lg" alt={props.alt || 'Image'} />;
        },
        p({ children }) {
          return <p className="text text-grey-200 my-4">{children}</p>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
    );
};

export default MessageMarkdown;
