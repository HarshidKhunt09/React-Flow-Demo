import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const CustomSelect = ({ label, selectedOption, onSelect, options }) => {
  return (
    <>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <Listbox value={selectedOption} onChange={onSelect}>
        {({ open }) => (
          <>
            <div className='relative'>
              <span className='inline-block w-full rounded-md shadow-sm'>
                <Listbox.Button className='cursor-pointer relative w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300'>
                  <span className='block truncate'>{selectedOption}</span>
                </Listbox.Button>
              </span>

              <Transition
                show={open}
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Listbox.Options
                  static
                  className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm'
                >
                  {options.map((option) => (
                    <Listbox.Option
                      key={option}
                      value={option}
                      className={({ active }) =>
                        `${
                          active ? 'text-white bg-blue-500' : 'text-gray-900'
                        } cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${
                              selected ? 'font-medium' : 'font-normal'
                            } block truncate`}
                          >
                            {option}
                          </span>
                          {selected ? (
                            <span
                              className={`${
                                active ? 'text-white' : 'text-blue-600'
                              } absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              {/* Checkmark icon */}
                              <svg
                                className='w-5 h-5'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                aria-hidden='true'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M0 11l2-2 5 5L18 3l2 2L7 18z'
                                />
                              </svg>
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  );
};

export default CustomSelect;
