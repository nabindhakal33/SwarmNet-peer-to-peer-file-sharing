import React from 'react'

import './App.css';
import { Progress, Box, ActionIcon, white } from '@mantine/core';
import { IconPlayerPause, IconCheckbox, IconFolder, IconTrash, IconPlayerPlay } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { emit } from '@tauri-apps/api/event';

const FileTransferComponent = ({ row, setTransfer }) => {

    const [paused, setPaused] = useState(false);
    const [progressColor, SetProgressColor] = useState('gray');
    const [progressText, setProgressText] = useState('Initializing download');

    useEffect(() => {
        console.log("status ", row?.status);
        if (row?.status > 0 && row?.status < 100) {
            setProgressText('Downloading');
            SetProgressColor('blue');

        } else if (parseInt(row?.status) === 100) {
            setProgressText('Seeding');
            SetProgressColor('green');
        }

    }, [row?.status]);

   

    const handleDeleteofDowloadedFile = async (fileName, fileHash) => {
        console.log("file_hash", fileHash);
        await emit('delete_file', { file_name: fileName, file_hash: fileHash });
        setTransfer((prev) => {
            return prev.filter((row) => row.fileHash !== fileHash);

        });
    };

    const handlePausePlay = () => {
        setPaused((prevPaused) => !prevPaused);
    };

    async function handleClickofDownloadedFile(fileHash) {
        await emit('open_downloads', {file_hash:fileHash });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    const progressTextStyle = {
        position: "absolute",
        marginLeft:60,
        color: "white",
        marginTop: -16,
        textTransform: 'uppercase',
        fontFamily: "Monospace",
        fontSize: 11
    };
    return (

        <tr key={row?.fileHash}>

            <td>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {progressText === "Seeding" ? (<IconCheckbox color={'#40bf55'} />) :
                        (<ActionIcon onClick={handlePausePlay}>
                            {paused ? (<IconPlayerPlay />) : (<IconPlayerPause />)}
                        </ActionIcon>)}
                    {row?.name}
                </Box>
            </td>
            <td>{progressText==="Seeding"?"":row?.down}</td>
            <td>{formatBytes(row?.fileSize)}</td>
            <td>

                            <div style={{position:"relative"}}>
                <Progress
                    value={row?.status}
                    color={progressColor}
                    size="lg"
                    radius="xl"
                    styles={{ root: { width: 200 } }}
                />
                <div style={progressTextStyle}>
                    {`${progressText} ${row?.status < 100 ? row?.status : ""} ${row?.status < 100 ? "%" : ""}`}
                </div>
                </div>
            </td>
            <td>
                {row?.remaining}
            </td>
            <td>
                {row?.seed}
            </td>
            <td> <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}><ActionIcon onClick={() => handleDeleteofDowloadedFile(row.name, row.fileHash)}><IconTrash className='delete-icon' /></ActionIcon><ActionIcon onClick={() => handleClickofDownloadedFile(row.fileHash)}><IconFolder className='file-explorer' /></ActionIcon ></Box></td>


        </tr>

    )
}

export default FileTransferComponent;