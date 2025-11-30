/**
 * HADES · PLUTON - Game Data
 * Elaborate underworld realms, narrative, and interactions
 * Inspired by Sopor Aeternus "Hades - Pluton" and the aesthetic of death, melancholy, and shadow
 */

const GAME_SCENES = {
    /**
     * THE RIVER STYX - Starting Location
     */
    river_styx: {
        title: 'The River Styx',
        depth: 'The First Veil',
        background: 'river-styx',
        description: `
            <p>You stand upon the obsidian shore where the living world dissolves into memory.
            The River Styx stretches before you, its black waters flowing with the tears of the forgotten,
            moving in impossible directions—upstream and down simultaneously, as if time itself has lost meaning.</p>

            <p>You are <strong>Anna-Varney Cantodea</strong>, and you have crossed the threshold between worlds.
            The air tastes of copper and ash. Mist coils around your ankles like the fingers of drowning souls.</p>

            <p>A skeletal ferryman waits by an ancient boat carved from a single piece of petrified shadow.</p>
        `,
        dialogue: {
            speaker: 'Charon, The Ferryman',
            text: `"Another soul seeking passage... But you are different. You walk with death's perfume,
                   yet still draw breath. What brings the living to my shore, child of sorrow?"`,
            choices: [
                {
                    text: '"I seek Hades, Lord of the Underworld. I have questions only he can answer."',
                    action: (game) => {
                        game.setFlag('charon_reason', 'seeking_hades');
                        game.addJournalEntry('Told Charon I seek an audience with Hades');
                    },
                    next: {
                        speaker: 'Charon',
                        text: `"Seeking the King of Shadows? Ambitious. The path to Pluton's throne is treacherous.
                               Many have descended... few return. I will grant you passage, but you must pay the price."`,
                        choices: [
                            {
                                text: '"What is your price, ferryman?"',
                                action: (game) => {
                                    game.setFlag('asked_price', true);
                                },
                                next: {
                                    speaker: 'Charon',
                                    text: `"Not coin, dear wanderer. I require a truth—something precious from your living heart.
                                           Tell me: What grief drives you to seek death's domain?"`,
                                    choices: [
                                        {
                                            text: '"I mourn the loss of beauty in a world that has forgotten darkness."',
                                            action: (game) => {
                                                game.setFlag('charon_answer', 'beauty');
                                                game.modifySanity(-5);
                                                game.addJournalEntry('Confessed my grief for lost beauty');
                                            }
                                        },
                                        {
                                            text: '"I seek to understand the nature of death itself."',
                                            action: (game) => {
                                                game.setFlag('charon_answer', 'knowledge');
                                                game.modifyEssence(-5);
                                                game.addJournalEntry('Confessed my thirst for forbidden knowledge');
                                            }
                                        },
                                        {
                                            text: '"I am already dead inside. I merely seek my proper home."',
                                            action: (game) => {
                                                game.setFlag('charon_answer', 'belonging');
                                                game.modifySanity(-10);
                                                game.addJournalEntry('Confessed the death within my soul');
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    text: '"I am lost, wandering between worlds. Perhaps I have always belonged here."',
                    action: (game) => {
                        game.setFlag('charon_reason', 'lost');
                        game.modifySanity(-5);
                        game.addJournalEntry('Admitted I am lost between worlds');
                    },
                    next: {
                        speaker: 'Charon',
                        text: `"Ah, a wandering shade in living flesh. How deliciously tragic.
                               Very well, I sense the shadow in your blood. Step aboard."`,
                    }
                }
            ]
        },
        objects: [
            {
                name: 'Ancient Coins',
                icon: '⚜',
                description: `A pile of tarnished coins scattered along the shore, offerings from souls who passed this way.
                             Each bears the face of someone forgotten.`,
                action: (game) => {
                    game.addToInventory({
                        id: 'ancient_coins',
                        name: 'Ancient Coins',
                        icon: '⚜',
                        description: 'Coins of the dead, still warm with fading memories'
                    });
                    game.addJournalEntry('Collected coins from the shore of the Styx');
                }
            },
            {
                name: 'Wilted Asphodel',
                icon: '🥀',
                description: `A flower that grows only in the realm of the dead, its petals the color of forgotten dreams.
                             It wilts the moment it's plucked, yet never fully dies.`,
                action: (game) => {
                    game.addToInventory({
                        id: 'asphodel',
                        name: 'Wilted Asphodel',
                        icon: '🥀',
                        description: 'An eternal flower caught between life and death'
                    });
                }
            },
            {
                name: 'Reflection in the Water',
                icon: '👁',
                description: `You gaze into the black waters. Your reflection stares back, but its expression is different—
                             sadder, older, as if showing what you will become.`,
                action: (game) => {
                    game.modifySanity(-3);
                    game.addJournalEntry('Saw a disturbing reflection in the Styx');
                    game.setFlag('saw_reflection', true);
                }
            }
        ],
        exits: [
            {
                label: 'Board Charon\'s Ferry',
                target: 'ferry_crossing',
                condition: (state) => state.flags.charon_answer || state.flags.charon_reason === 'lost'
            }
        ],
        onEnter: (game) => {
            if (!game.getFlag('first_arrival')) {
                game.setFlag('first_arrival', true);
                game.addJournalEntry('Arrived at the River Styx');
            }
        }
    },

    /**
     * THE FERRY CROSSING
     */
    ferry_crossing: {
        title: 'Crossing the Styx',
        depth: 'Between Worlds',
        background: 'ferry',
        description: `
            <p>The ferry glides across the impossible waters, propelled by Charon's pole of bleached bone.
            The world you knew fades behind you like a half-remembered dream.</p>

            <p>Below the surface, you can see them—pale faces pressed against the underside of the water,
            mouths open in silent screams. The unpaid dead, forever trapped between shores.</p>

            <p>The fog grows thicker. Strange lights flicker in the distance like will-o'-wisps,
            beckoning toward hidden depths.</p>
        `,
        objects: [
            {
                name: 'Souls in the Water',
                icon: '💀',
                description: `Countless spirits thrash beneath the black surface. One reaches up, its hand breaking
                             through the water, grasping desperately for the living warmth it can sense in you.`,
                action: (game) => {
                    game.showDialogue({
                        speaker: 'Drowning Soul',
                        text: '"Please... remember my name... remember..."',
                        choices: [
                            {
                                text: 'Reach out and touch the spectral hand',
                                action: (game) => {
                                    game.modifyEssence(-10);
                                    game.addJournalEntry('Touched a drowning soul - felt the cold of eternity');
                                    game.setFlag('touched_soul', true);
                                    game.showNotification('The cold burns like fire');
                                }
                            },
                            {
                                text: 'Look away and let it sink',
                                action: (game) => {
                                    game.modifySanity(-5);
                                    game.addJournalEntry('Turned away from a pleading soul');
                                    game.setFlag('ignored_soul', true);
                                }
                            }
                        ]
                    });
                }
            },
            {
                name: 'Charon\'s Lantern',
                icon: '🕯',
                description: `A lantern hanging from the ferry's prow, burning with a cold blue flame that seems to
                             feed on darkness rather than light.`,
                dialogue: {
                    speaker: 'Charon',
                    text: `"That flame has burned for ten thousand years, fueled by the last breath of dying stars.
                           It shows the way through realms where even death fears to tread."`
                }
            }
        ],
        exits: [
            {
                label: 'Continue to the Far Shore',
                target: 'gates_of_hades'
            }
        ]
    },

    /**
     * THE GATES OF HADES
     */
    gates_of_hades: {
        title: 'The Adamantine Gates',
        depth: 'The Second Veil',
        background: 'gates',
        description: `
            <p>Before you rise the Adamantine Gates, forged from unbreakable metal by the Cyclopes in the dawn of time.
            They are inscribed with the names of every soul who has ever died, the letters shifting and rearranging
            themselves in an endless, hypnotic dance.</p>

            <p>The three-headed hound <strong>Cerberus</strong> guards the threshold. Each head watches a different
            reality—past, present, and future. His eyes burn with an intelligence far older than the gods themselves.</p>

            <p>Beyond the gates, you can see the beginning of the Asphodel Meadows, a vast grey plain where common souls
            wander in eternal twilight.</p>
        `,
        dialogue: {
            speaker: 'Cerberus',
            text: `*All three heads speak in unison, their voices creating an eerie harmony*
                   "Living flesh. Beating heart. You do not belong here, yet here you stand.
                   The gates open for the dead, but for the living... there must be a test."`,
            choices: [
                {
                    text: '"What test must I pass, great guardian?"',
                    action: (game) => {
                        game.setFlag('cerberus_polite', true);
                    },
                    next: {
                        speaker: 'Cerberus (Past Head)',
                        text: '"Answer three riddles, one from each of us. Answer correctly, and pass. Fail, and remain here as our companion... forever."',
                        choices: [
                            {
                                text: '"I accept your challenge."',
                                action: (game) => {
                                    game.setFlag('cerberus_challenge', true);
                                },
                                next: {
                                    speaker: 'Cerberus (Past Head)',
                                    text: `"First riddle: I am the mother of all sorrow, the father of all joy.
                                           I am the beginning and the end. Kings and beggars both bow before me. What am I?"`,
                                    choices: [
                                        {
                                            text: '"Death."',
                                            action: (game) => {
                                                game.setFlag('riddle1', 'correct');
                                                game.addJournalEntry('Answered the first riddle correctly');
                                            },
                                            next: {
                                                speaker: 'Cerberus (Present Head)',
                                                text: `"Correct. Second riddle: I am always hungry, I must always be fed.
                                                       The finger I touch will soon turn red. What am I?"`,
                                                choices: [
                                                    {
                                                        text: '"Fire."',
                                                        action: (game) => {
                                                            game.setFlag('riddle2', 'correct');
                                                            game.addJournalEntry('Answered the second riddle correctly');
                                                        },
                                                        next: {
                                                            speaker: 'Cerberus (Future Head)',
                                                            text: `"Correct again. Final riddle: I follow you all your life,
                                                                   yet you can never catch me. In light I am strong, in darkness I disappear.
                                                                   What am I?"`,
                                                            choices: [
                                                                {
                                                                    text: '"My shadow."',
                                                                    action: (game) => {
                                                                        game.setFlag('riddle3', 'correct');
                                                                        game.addJournalEntry('Solved all three riddles of Cerberus');
                                                                        game.modifyEssence(10);
                                                                    },
                                                                    next: {
                                                                        speaker: 'Cerberus',
                                                                        text: `*All three heads bow* "Wise and worthy. Few answer all three correctly.
                                                                               You may pass, Anna-Varney Cantodea. But know this—the path ahead grows darker still."`
                                                                    }
                                                                },
                                                                {
                                                                    text: '"Death." (wrong)',
                                                                    action: (game) => {
                                                                        game.modifySanity(-15);
                                                                        game.addJournalEntry('Failed the third riddle');
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        text: '"Hunger." (wrong)',
                                                        action: (game) => {
                                                            game.modifySanity(-15);
                                                            game.addJournalEntry('Failed the second riddle');
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            text: '"Time." (wrong)',
                                            action: (game) => {
                                                game.modifySanity(-15);
                                                game.addJournalEntry('Failed the first riddle');
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    text: '"I offer you a gift instead." (if you have Asphodel)',
                    condition: (state) => state.inventory.some(i => i.id === 'asphodel'),
                    action: (game) => {
                        game.removeFromInventory('asphodel');
                        game.setFlag('gave_asphodel', true);
                        game.addJournalEntry('Offered the Asphodel to Cerberus');
                    },
                    next: {
                        speaker: 'Cerberus',
                        text: `*The three heads sniff the flower, and for a moment, they seem to smile*
                               "A flower from our own realm, given freely. You understand the ways of the dead. Pass, wanderer."`
                    }
                }
            ]
        },
        objects: [
            {
                name: 'Inscribed Gates',
                icon: '📜',
                description: `You search the ever-shifting names on the gates. For a moment, you see your own name appear,
                             then vanish. Was it a warning? A prophecy? Or just a trick of the shadows?`,
                action: (game) => {
                    game.modifySanity(-5);
                    game.addJournalEntry('Saw my own name on the Gates of Hades');
                    game.setFlag('saw_name', true);
                }
            }
        ],
        exits: [
            {
                label: 'Enter the Asphodel Meadows',
                target: 'asphodel_meadows',
                condition: (state) => state.flags.riddle3 === 'correct' || state.flags.gave_asphodel
            },
            {
                label: 'Return to the River (if failed)',
                target: 'river_styx',
                condition: (state) => state.flags.cerberus_challenge && state.flags.riddle3 !== 'correct' && !state.flags.gave_asphodel
            }
        ]
    },

    /**
     * THE ASPHODEL MEADOWS
     */
    asphodel_meadows: {
        title: 'The Asphodel Meadows',
        depth: 'The Third Veil',
        background: 'meadows',
        description: `
            <p>An endless grey plain stretches in all directions, covered in pale asphodel flowers that glow with
            a faint, sickly luminescence. The sky above is neither day nor night—a perpetual twilight that weighs
            on the soul like a heavy shroud.</p>

            <p>Millions of shades wander here, the ordinary dead who were neither virtuous enough for Elysium nor
            wicked enough for Tartarus. They drift like smoke, barely aware of each other, trapped in the monotony
            of their own fading memories.</p>

            <p>In the distance, you can see three paths: one leading to the Fields of Punishment, one to the
            Elysian Fields, and one to the Palace of Hades itself.</p>
        `,
        objects: [
            {
                name: 'Wandering Shade',
                icon: '👻',
                description: `A ghost drifts toward you, its features vague and indistinct, like a photograph left too long in the sun.`,
                dialogue: {
                    speaker: 'Lost Shade',
                    text: '"Who... who are you? Are you real? I can\'t remember... can\'t remember if I\'m real..."',
                    choices: [
                        {
                            text: '"What is your name?"',
                            action: (game) => {
                                game.addJournalEntry('Spoke with a lost shade');
                            },
                            next: {
                                speaker: 'Lost Shade',
                                text: `"Name? I... I had one once. It\'s gone now. Everything is gone. How long have I been here?
                                       Minutes? Centuries? Tell me—is the sun still warm in the world above?"`
                            }
                        },
                        {
                            text: '"You are real, and so am I."',
                            action: (game) => {
                                game.modifyEssence(-5);
                                game.addJournalEntry('Gave comfort to a lost shade');
                            },
                            next: {
                                speaker: 'Lost Shade',
                                text: `"Real... yes. Thank you for remembering me, even for this moment. That's all we have here—moments, floating in an ocean of grey..."
                                       *The shade fades, seeming slightly more solid than before*`
                            }
                        }
                    ]
                }
            },
            {
                name: 'Memory Echo',
                icon: '✨',
                description: `A strange shimmer in the air—a fragment of someone's memory, crystallized and left behind.`,
                action: (game) => {
                    const memories = [
                        'A child laughing in summer grass...',
                        'A first kiss under autumn leaves...',
                        'The smell of bread baking in the morning...',
                        'Dancing in the rain, completely free...',
                        'A mother\'s lullaby, soft and warm...'
                    ];
                    const memory = memories[Math.floor(Math.random() * memories.length)];
                    game.showNotification(`Memory: ${memory}`);
                    game.modifySanity(5);
                    game.addJournalEntry(`Witnessed a memory: ${memory}`);
                }
            },
            {
                name: 'Field of Flowers',
                icon: '🌾',
                description: `The asphodel flowers stretch endlessly. Each bloom represents a forgotten life.
                             You could wander here forever, becoming one with the grey...`,
                action: (game) => {
                    game.modifySanity(-3);
                    game.addJournalEntry('Contemplated eternity in the Asphodel Meadows');
                }
            }
        ],
        exits: [
            {
                label: 'Journey to Tartarus (The Fields of Punishment)',
                target: 'tartarus_entrance'
            },
            {
                label: 'Seek the Elysian Fields',
                target: 'elysium_gates'
            },
            {
                label: 'Approach the Palace of Hades',
                target: 'palace_approach'
            }
        ]
    },

    /**
     * TARTARUS ENTRANCE
     */
    tartarus_entrance: {
        title: 'The Precipice of Tartarus',
        depth: 'The Fourth Veil - Abyss',
        background: 'tartarus',
        description: `
            <p>You stand at the edge of a vast chasm that descends into absolute darkness. This is <strong>Tartarus</strong>,
            the prison of the damned, the pit below the underworld itself. The air here screams—literally screams—with
            the voices of tortured souls.</p>

            <p>Chains as thick as ancient trees stretch down into the abyss, binding titans and monsters.
            You can feel the heat rising from below, and with it, the stench of sulfur and despair.</p>

            <p>Three figures in black robes stand near the edge, observing the torments below.
            These are the <strong>Erinyes</strong>—the Furies, spirits of vengeance.</p>
        `,
        dialogue: {
            speaker: 'The Furies',
            text: `*Three voices speak as one* "A living soul at the gates of punishment? How delicious.
                   Have you come to confess your sins, child? Or to witness the fate that awaits the guilty?"`,
            choices: [
                {
                    text: '"I wish only to understand the nature of suffering."',
                    action: (game) => {
                        game.setFlag('furies_philosophical', true);
                    },
                    next: {
                        speaker: 'Megaera',
                        text: `"Understanding comes through experience. We could show you... intimately.
                               Or you could simply look into the Pit of Ixion and see for yourself."`
                    }
                },
                {
                    text: '"I have committed no crime. I do not belong here."',
                    action: (game) => {
                        game.setFlag('furies_defensive', true);
                    },
                    next: {
                        speaker: 'Alecto',
                        text: `"No crime? Every living soul carries guilt. Let us see yours..."
                               *Her eyes flash red* "Ah yes, we see it now. Shall we enumerate your transgressions?"`
                    }
                },
                {
                    text: '"I seek passage to the deeper realms."',
                    action: (game) => {
                        game.setFlag('furies_passage', true);
                    },
                    next: {
                        speaker: 'Tisiphone',
                        text: `"Deeper? There is nothing deeper than this save oblivion itself.
                               But if you truly wish to descend... we require payment. A confession of true guilt."`
                    }
                }
            ]
        },
        objects: [
            {
                name: 'The Pit of Ixion',
                icon: '🔥',
                description: `You peer into one of the punishment chambers. King Ixion is bound to a burning wheel,
                             spinning for eternity. As you watch, he looks up, and your eyes meet.
                             In that instant, you feel his pain—every second of every century.`,
                action: (game) => {
                    game.modifySanity(-20);
                    game.modifyEssence(-10);
                    game.addJournalEntry('Witnessed the eternal torture of Ixion');
                    game.setFlag('witnessed_ixion', true);
                    game.showNotification('The agony is unbearable...');
                }
            },
            {
                name: 'Chains of the Titans',
                icon: '⛓',
                description: `Ancient chains that once bound the Titans. They hum with divine power,
                             and touching them fills you with a strange sense of cosmic dread.`,
                action: (game) => {
                    game.modifySanity(-10);
                    game.addToInventory({
                        id: 'titan_chain_link',
                        name: 'Link of Titan Chains',
                        icon: '⛓',
                        description: 'A piece of the chains that bound the Titans—impossibly heavy yet weightless'
                    });
                    game.addJournalEntry('Took a piece of the Titan chains');
                }
            },
            {
                name: 'River of Fire (Phlegethon)',
                icon: '🌊',
                description: `One of the five rivers of Hades, flowing with liquid fire. It burns with the rage
                             of the damned, yet you feel drawn to its terrible beauty.`,
                action: (game) => {
                    game.showDialogue({
                        speaker: 'Inner Voice',
                        text: 'The flames call to you. You could drink from the river, though the consequences would be severe...',
                        choices: [
                            {
                                text: 'Drink from the Phlegethon',
                                action: (game) => {
                                    game.modifyEssence(-30);
                                    game.modifySanity(-20);
                                    game.setFlag('drank_phlegethon', true);
                                    game.addJournalEntry('Drank from the River of Fire—the pain is eternal');
                                    game.showNotification('The fire burns through your very essence!');
                                    game.addToInventory({
                                        id: 'fire_within',
                                        name: 'Fire Within',
                                        icon: '🔥',
                                        description: 'A flame now burns inside you, terrible and transformative'
                                    });
                                }
                            },
                            {
                                text: 'Step away from the flames',
                                action: (game) => {
                                    game.addJournalEntry('Resisted the call of the Phlegethon');
                                }
                            }
                        ]
                    });
                }
            }
        ],
        exits: [
            {
                label: 'Descend Deeper into Tartarus',
                target: 'tartarus_depths',
                condition: (state) => state.flags.furies_passage
            },
            {
                label: 'Return to the Asphodel Meadows',
                target: 'asphodel_meadows'
            }
        ]
    },

    /**
     * TARTARUS DEPTHS
     */
    tartarus_depths: {
        title: 'The Depths of Tartarus',
        depth: 'The Fifth Veil - Abyss Eternal',
        background: 'tartarus-deep',
        description: `
            <p>This is the deepest pit of Tartarus, a place so far from the light that even the gods fear it.
            Here, the primordial forces of chaos are imprisoned—entities older than Zeus, older than time.</p>

            <p>The darkness here is not merely the absence of light; it is a living thing, hungry and aware.
            You can feel it pressing against your consciousness, trying to devour your sense of self.</p>

            <p>In the center of this abyss, you see a figure bound in chains of pure darkness.
            This is <strong>Chronos</strong>, the Titan of Time, imprisoned here since the dawn of the gods.</p>
        `,
        dialogue: {
            speaker: 'Chronos',
            text: `*A voice that sounds like the grinding of continental plates*
                   "A mortal... here? Impossible. Time itself has forgotten this place. Yet you stand before me,
                   a paradox made flesh. Why have you come to the end of all things?"`,
            choices: [
                {
                    text: '"I seek knowledge of death and time."',
                    action: (game) => {
                        game.setFlag('chronos_knowledge', true);
                    },
                    next: {
                        speaker: 'Chronos',
                        text: `"Death and time are lovers, eternally intertwined. Death is merely time's final kiss.
                               But you... you seek to understand what cannot be understood while still breathing.
                               I can grant you vision, but it will cost you."`
                    }
                },
                {
                    text: '"I wish to free you."',
                    action: (game) => {
                        game.setFlag('chronos_freedom', true);
                        game.modifySanity(-25);
                    },
                    next: {
                        speaker: 'Chronos',
                        text: `*Laughter like thunder* "Free me? Child, if I were freed, time would collapse.
                               Past, present, and future would become one. Reality itself would unravel.
                               But your offer amuses me. I will give you a gift."`
                    }
                }
            ]
        },
        objects: [
            {
                name: 'Temporal Tear',
                icon: '⚡',
                description: `A rip in the fabric of time itself. Through it, you can see fragments of your past,
                             your present, and your many possible futures, all happening simultaneously.`,
                action: (game) => {
                    game.modifySanity(-15);
                    game.addToInventory({
                        id: 'time_shard',
                        name: 'Shard of Broken Time',
                        icon: '⚡',
                        description: 'A fragment of time that should not exist'
                    });
                    game.addJournalEntry('Gazed into the temporal tear—saw all times as one');
                }
            }
        ],
        exits: [
            {
                label: 'Ascend from the Abyss',
                target: 'tartarus_entrance'
            }
        ]
    },

    /**
     * ELYSIUM GATES
     */
    elysium_gates: {
        title: 'Gates of the Elysian Fields',
        depth: 'The Fourth Veil - Paradise',
        background: 'elysium',
        description: `
            <p>Before you lie the blessed <strong>Elysian Fields</strong>, paradise for the heroic and virtuous.
            Unlike the grey monotony of Asphodel, this place glows with golden light.
            You can hear music—real music—and laughter, strange and beautiful after the silence of the dead.</p>

            <p>The gates are made of ivory and gold, carved with scenes of legendary deeds.
            Heroes and philosophers walk in gardens of impossible beauty, forever young, forever content.</p>

            <p>A radiant figure stands at the gate—<strong>Orpheus</strong>, the greatest musician who ever lived,
            who once descended to the underworld for love and failed.</p>
        `,
        dialogue: {
            speaker: 'Orpheus',
            text: `"Another living soul walks in Hades' realm. I remember when I did the same, seeking my Eurydice.
                   Tell me, what love or loss brings you to this place?"`,
            choices: [
                {
                    text: '"I seek understanding, not love."',
                    action: (game) => {
                        game.setFlag('orpheus_understanding', true);
                    },
                    next: {
                        speaker: 'Orpheus',
                        text: `"Understanding and love are not so different. Both require seeing beyond the surface.
                               Both can destroy you. I learned that the hard way." *His eyes grow distant*
                               "I looked back. One moment of doubt, and I lost everything."`
                    }
                },
                {
                    text: '"I am drawn to darkness and beauty in equal measure."',
                    action: (game) => {
                        game.setFlag('orpheus_kindred', true);
                        game.modifyEssence(5);
                    },
                    next: {
                        speaker: 'Orpheus',
                        text: `"Ah, a kindred spirit. You understand that the most beautiful songs are born from sorrow.
                               Come, let me play for you." *He raises his lyre*
                               "This is the song I played for Hades himself—the Song of Lost Love."`
                    }
                }
            ]
        },
        objects: [
            {
                name: 'Orpheus\'s Lyre',
                icon: '🎵',
                description: `The legendary lyre that charmed even the stones to tears. Orpheus allows you to pluck a single string.`,
                action: (game) => {
                    game.modifySanity(20);
                    game.modifyEssence(10);
                    game.addJournalEntry('Heard the song of Orpheus—felt beauty beyond mortal comprehension');
                    game.setFlag('heard_orpheus', true);
                    game.showNotification('The music fills you with bittersweet joy');
                }
            },
            {
                name: 'Garden of Heroes',
                icon: '🌺',
                description: `Heroes from legend feast and train in eternal sunlight. Achilles spars with Hector,
                             their ancient enmity forgotten. They barely notice you—what is one more wanderer to those who have seen millennia?`,
                action: (game) => {
                    game.addJournalEntry('Observed the heroes of legend in their eternal paradise');
                }
            }
        ],
        exits: [
            {
                label: 'Enter the Elysian Fields',
                target: 'elysium_interior',
                condition: (state) => state.flags.orpheus_kindred
            },
            {
                label: 'Return to the Meadows',
                target: 'asphodel_meadows'
            }
        ]
    },

    /**
     * ELYSIUM INTERIOR
     */
    elysium_interior: {
        title: 'Within the Elysian Fields',
        depth: 'Paradise Eternal',
        background: 'elysium-fields',
        description: `
            <p>You walk among the blessed dead, and the contrast with the grey wastes of Asphodel could not be starker.
            Here, the grass is green, the sky is blue, and the sun—a sun!—warms your skin.</p>

            <p>Yet something feels wrong. The happiness here is too perfect, too unchanging.
            The heroes laugh, but their laughter is the same today as it was a thousand years ago.
            Paradise, you realize, is another kind of prison.</p>
        `,
        objects: [
            {
                name: "Philosopher's Circle",
                icon: '📚',
                description: `Great thinkers sit in eternal debate. Socrates argues with Plato, their words as sharp
                             as they were in life. They welcome you to join.`,
                dialogue: {
                    speaker: 'Socrates',
                    text: '"Tell me, living one—is it better to live a short life full of meaning, or an eternal life of contentment?"',
                    choices: [
                        {
                            text: '"A short life of meaning."',
                            action: (game) => {
                                game.modifySanity(10);
                                game.addJournalEntry('Debated philosophy with Socrates');
                            }
                        },
                        {
                            text: '"Eternal contentment."',
                            action: (game) => {
                                game.modifySanity(-5);
                            }
                        },
                        {
                            text: '"Neither—I choose the darkness between."',
                            action: (game) => {
                                game.setFlag('socrates_impressed', true);
                                game.modifyEssence(10);
                            },
                            next: {
                                speaker: 'Socrates',
                                text: '*Raises an eyebrow* "A third path. How delightfully unexpected. Perhaps wisdom lies not in the extremes, but in the shadows between them."'
                            }
                        }
                    ]
                }
            }
        ],
        exits: [
            {
                label: 'Leave Paradise Behind',
                target: 'elysium_gates'
            }
        ]
    },

    /**
     * PALACE APPROACH
     */
    palace_approach: {
        title: 'The Palace of Hades',
        depth: 'The Heart of the Underworld',
        background: 'palace',
        description: `
            <p>The palace of <strong>Hades and Persephone</strong> rises before you like a mountain of black marble and obsidian.
            It is both magnificent and terrible, a structure that seems to exist in multiple dimensions simultaneously.</p>

            <p>The entrance is guarded by two massive statues of skeletal warriors, their empty eyes tracking your approach.
            The doors are carved with scenes from the myths—the abduction of Persephone, the descent of Orpheus,
            the labors of Heracles.</p>

            <p>Standing before the doors is <strong>Hecate</strong>, goddess of witchcraft and crossroads,
            holding her twin torches that burn with different colored flames.</p>
        `,
        dialogue: {
            speaker: 'Hecate',
            text: `"So you have reached the threshold of the King and Queen of the Dead. Impressive, for one still bound to life.
                   But before you may enter, you must make a choice—a choice that will define your audience with Hades."`,
            choices: [
                {
                    text: '"What choice must I make?"',
                    next: {
                        speaker: 'Hecate',
                        text: `"I hold two torches. The black flame shows truth without mercy—you will see yourself and the world as they truly are,
                               stripped of all illusion. The white flame shows beauty without truth—you will see only what brings comfort,
                               even if it is a lie. Choose one, and its light will guide you before the throne."`,
                        choices: [
                            {
                                text: 'Take the Black Flame (Truth)',
                                action: (game) => {
                                    game.setFlag('chose_truth', true);
                                    game.modifySanity(-20);
                                    game.modifyEssence(20);
                                    game.addJournalEntry('Chose the Black Flame—truth without mercy');
                                }
                            },
                            {
                                text: 'Take the White Flame (Beauty)',
                                action: (game) => {
                                    game.setFlag('chose_beauty', true);
                                    game.modifySanity(20);
                                    game.modifyEssence(-20);
                                    game.addJournalEntry('Chose the White Flame—beauty without truth');
                                }
                            },
                            {
                                text: 'Refuse both—walk in darkness',
                                action: (game) => {
                                    game.setFlag('chose_darkness', true);
                                    game.modifySanity(-10);
                                    game.modifyEssence(-10);
                                    game.addJournalEntry('Rejected both flames—chose to walk in absolute darkness');
                                },
                                next: {
                                    speaker: 'Hecate',
                                    text: '*Smiles for the first time* "A third path. Always a third path with the truly interesting ones. Very well—walk in shadow, Anna-Varney."'
                                }
                            }
                        ]
                    }
                }
            ]
        },
        objects: [
            {
                name: 'Pomegranate Tree',
                icon: '🍎',
                description: `A tree bearing the fruit that bound Persephone to the underworld. Six pomegranates hang from its branches—
                             six months in the land of the dead for each one eaten.`,
                action: (game) => {
                    game.showDialogue({
                        speaker: 'Inner Voice',
                        text: 'Eat the pomegranate, and you will be bound to this realm forever. But you will understand its mysteries completely.',
                        choices: [
                            {
                                text: 'Eat the pomegranate',
                                action: (game) => {
                                    game.setFlag('ate_pomegranate', true);
                                    game.modifySanity(-30);
                                    game.modifyEssence(-30);
                                    game.addJournalEntry('Ate the pomegranate of the underworld—I am bound to death now');
                                    game.showNotification('You belong to death now...');
                                    game.addToInventory({
                                        id: 'pomegranate_seed',
                                        name: 'Pomegranate Seed',
                                        icon: '🍎',
                                        description: 'The seed of binding—you are tied to the underworld forever'
                                    });
                                }
                            },
                            {
                                text: 'Leave it alone',
                                action: (game) => {
                                    game.addJournalEntry('Resisted the temptation of the pomegranate');
                                }
                            }
                        ]
                    });
                }
            }
        ],
        exits: [
            {
                label: 'Enter the Throne Room',
                target: 'throne_room',
                condition: (state) => state.flags.chose_truth || state.flags.chose_beauty || state.flags.chose_darkness
            },
            {
                label: 'Return to the Meadows',
                target: 'asphodel_meadows'
            }
        ]
    },

    /**
     * THRONE ROOM - CLIMAX
     */
    throne_room: {
        title: 'The Throne of Hades and Persephone',
        depth: 'The Seat of Death',
        background: 'throne',
        description: `
            <p>The throne room is vast beyond comprehension, its ceiling lost in shadows that seem to contain entire galaxies.
            Two thrones dominate the space, carved from a single piece of meteor-black stone.</p>

            <p>Upon the first throne sits <strong>Hades, Lord of the Dead</strong>, his face beautiful and terrible,
            ancient beyond reckoning. His eyes are the color of the void between stars.</p>

            <p>Upon the second throne sits <strong>Persephone, Queen of the Underworld</strong>, equally beautiful,
            wearing a crown of bones and flowers. She is both spring maiden and death goddess, and the contradiction
            makes her more powerful than either aspect alone.</p>

            <p>They regard you with interest—rare for beings who have seen countless millennia pass.</p>
        `,
        dialogue: {
            speaker: 'Hades',
            text: `"Anna-Varney Cantodea. Yes, we know your name. We know all names. You have journeyed far,
                   survived tests, and reached our throne while still drawing breath. Speak—what do you seek
                   in the realm of death?"`,
            choices: [
                {
                    text: '"I seek to understand death, so I can understand life."',
                    action: (game) => {
                        game.setFlag('hades_understanding', true);
                    },
                    next: {
                        speaker: 'Persephone',
                        text: `"A philosopher's quest. Death and life are not opposites, child—they are partners in an eternal dance.
                               I should know. I walk in both worlds." *She gestures to the pomegranate tree*
                               "Six months in shadow, six in light. The balance is everything."`
                    }
                },
                {
                    text: '"I wish to dwell in darkness forever."',
                    action: (game) => {
                        game.setFlag('hades_stay', true);
                        game.modifySanity(-15);
                    },
                    next: {
                        speaker: 'Hades',
                        text: `*A slight smile* "You wish to remain? How refreshing. Most beg to leave. But you—
                               you recognize the beauty in shadow, the peace in endings. I could grant your wish,
                               but are you certain? Eternity is longer than you can possibly imagine."`
                    }
                },
                {
                    text: '"I seek inspiration for my art—the beauty of melancholy."',
                    action: (game) => {
                        game.setFlag('hades_art', true);
                        game.modifyEssence(10);
                    },
                    next: {
                        speaker: 'Persephone',
                        text: `"An artist! How wonderful. Yes, there is great beauty here—terrible beauty.
                               The aesthetics of decay, the poetry of loss. Take what you have seen and transform it.
                               That is the true power of art—to make meaning from suffering."`
                    }
                }
            ]
        },
        objects: [
            {
                name: 'Helm of Darkness',
                icon: '👑',
                description: `Hades' legendary helm, which grants invisibility even to gods. It sits on a pedestal near the throne,
                             radiating an aura of absolute concealment.`,
                action: (game) => {
                    game.showDialogue({
                        speaker: 'Hades',
                        text: 'You dare reach for my helm? Bold. I could punish such presumption... or reward such courage. Tell me—why should I let you touch it?',
                        choices: [
                            {
                                text: '"I wish to disappear from a world that doesn\'t understand me."',
                                action: (game) => {
                                    game.setFlag('touched_helm', true);
                                    game.modifySanity(-10);
                                    game.addJournalEntry('Touched the Helm of Darkness');
                                    game.showNotification('You feel yourself fading...');
                                }
                            },
                            {
                                text: '"I apologize, Lord Hades."',
                                action: (game) => {
                                    game.addJournalEntry('Showed respect to Hades');
                                }
                            }
                        ]
                    });
                }
            },
            {
                name: 'The Book of the Dead',
                icon: '📖',
                description: `A massive tome containing every name of every soul that has ever died, is dying, or will die.
                             The pages turn themselves, always showing the deaths happening at this very moment.`,
                action: (game) => {
                    game.modifySanity(-15);
                    game.addJournalEntry('Read from the Book of the Dead—saw my own death written in its pages');
                    game.setFlag('saw_own_death', true);
                    game.showNotification('You saw when and how you will die...');
                }
            }
        ],
        exits: [
            {
                label: 'Request to Return to the Living World',
                target: 'return_journey'
            },
            {
                label: 'Request to Stay in the Underworld',
                target: 'eternal_ending',
                condition: (state) => state.flags.hades_stay || state.flags.ate_pomegranate
            }
        ]
    },

    /**
     * RETURN JOURNEY
     */
    return_journey: {
        title: 'The Path of Return',
        depth: 'Between Death and Life',
        background: 'return',
        description: `
            <p>Hades has granted you permission to return to the living world, but with a warning:
            "You will carry the shadow of this place with you always. You have seen too much to ever be fully alive again."</p>

            <p>Persephone gives you a gift—a single asphodel flower that will never die, and never truly live.</p>

            <p>The journey back is different from the descent. The path seems longer, and you can feel yourself
            becoming less real with each step, as if you're slowly turning into a shade yourself.</p>

            <p>Charon waits at the river once more, his ferry ready to carry you back to the shore of the living.</p>
        `,
        dialogue: {
            speaker: 'Charon',
            text: `"Returning, are you? You look different than when you arrived. You have the eyes of one who has seen
                   beyond the veil. That sight will never leave you. Tell me—was your journey worth the price?"`,
            choices: [
                {
                    text: '"Yes. I understand now."',
                    action: (game) => {
                        game.setFlag('journey_worthwhile', true);
                        game.addJournalEntry('Returned from the underworld with understanding');
                    }
                },
                {
                    text: '"I\'m not sure. Perhaps I was better off in ignorance."',
                    action: (game) => {
                        game.setFlag('journey_regret', true);
                        game.modifySanity(-10);
                    }
                },
                {
                    text: '"The journey is never over."',
                    action: (game) => {
                        game.setFlag('journey_eternal', true);
                        game.modifyEssence(15);
                    }
                }
            ]
        },
        exits: [
            {
                label: 'Cross the Styx to the Living World',
                target: 'ending_return'
            }
        ]
    },

    /**
     * ENDINGS
     */
    ending_return: {
        title: 'Return to Life',
        depth: 'The Threshold',
        background: 'ending-return',
        description: `
            <p>You step off Charon's ferry onto the shore of the living world. The air feels different—thinner, colder.
            Colors seem muted compared to the stark contrasts of the underworld.</p>

            <p>You are changed. You carry the shadow of death within you now, a permanent mark of your journey.
            When you look in mirrors, sometimes you see a shade instead of a reflection.</p>

            <p>But you also carry something precious: knowledge. Understanding. The certainty that death is not an ending
            but a transformation, and that beauty exists in the darkest places.</p>

            <p>Your journey through Hades has ended, but the true journey—the journey of living with what you've learned—
            has only begun.</p>

            <p class="ending-text"><em>"In the shadows, I found light. In death, I found meaning.
            I am Anna-Varney Cantodea, walker of the threshold, and I am home."</em></p>

            <p><strong>THE END</strong></p>
            <p>(Thank you for playing)</p>
        `,
        objects: [],
        exits: [
            {
                label: 'Begin Journey Anew',
                target: 'river_styx',
                action: (game) => {
                    game.restartGame();
                }
            }
        ]
    },

    eternal_ending: {
        title: 'Eternal Dwelling in Shadow',
        depth: 'Forever',
        background: 'ending-eternal',
        description: `
            <p>Hades and Persephone smile—a rare expression on the faces of death's rulers.</p>

            <p>"So be it," Hades declares. "You shall dwell here as neither living nor dead, but something in between.
            A curator of shadows, a witness to eternity."</p>

            <p>You feel your mortality slipping away like sand through fingers. Your heartbeat slows... slows...
            but does not stop entirely. You exist now in the liminal space between states of being.</p>

            <p>Centuries pass. Millennia. You walk the asphodel fields, converse with shades, witness the endless
            cycle of death and forgetting. You have become part of the underworld's mythology—the Living Shade,
            they call you. The one who chose shadow over light.</p>

            <p>Sometimes you wonder if you made the right choice. But mostly, you feel at peace.
            You have found your place in the universe—in the darkness between heartbeats,
            in the silence between songs.</p>

            <p class="ending-text"><em>"I am eternal now, neither alive nor dead.
            I am the shadow that watches, the memory that lingers. I am Anna-Varney Cantodea,
            and I am finally home."</em></p>

            <p><strong>THE END</strong></p>
            <p>(You chose to remain in the underworld forever)</p>
        `,
        objects: [],
        exits: []
    }
};
