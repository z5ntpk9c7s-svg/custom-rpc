import { metro } from '@unbound-app/api';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const SOCKET_ID = 'custom-rpc';
const ACTIVITY_TYPES = [
	{ label: 'Playing', value: 0 },
	{ label: 'Streaming', value: 1 },
	{ label: 'Listening', value: 2 },
	{ label: 'Watching', value: 3 },
	{ label: 'Competing', value: 5 },
] as const;

type PresenceDraft = {
	name: string;
	details: string;
	state: string;
	type: number;
};

const INITIAL_DRAFT: PresenceDraft = {
	name: 'My Activity',
	details: 'What I am doing',
	state: 'A little more detail',
	type: 0,
};

let draft = { ...INITIAL_DRAFT };

const styles = {
	page: { padding: 16, gap: 16 },
	heading: { color: '#f2f3f5', fontSize: 20, fontWeight: '700' as const },
	label: { color: '#b5bac1', fontSize: 13, fontWeight: '600' as const, marginBottom: 6 },
	field: {
		backgroundColor: '#1e1f22',
		borderColor: '#3f4147',
		borderRadius: 8,
		borderWidth: 1,
		color: '#f2f3f5',
		minHeight: 44,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	section: { gap: 12 },
	typeRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8 },
	typeButton: {
		borderColor: '#4e5058',
		borderRadius: 16,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	typeButtonSelected: { backgroundColor: '#5865f2', borderColor: '#5865f2' },
	typeText: { color: '#dbdee1', fontSize: 13, fontWeight: '600' as const },
	preview: {
		backgroundColor: '#2b2d31',
		borderRadius: 8,
		flexDirection: 'row' as const,
		gap: 12,
		padding: 14,
	},
	previewIcon: {
		alignItems: 'center' as const,
		backgroundColor: '#5865f2',
		borderRadius: 8,
		height: 56,
		justifyContent: 'center' as const,
		width: 56,
	},
	previewIconText: { color: '#fff', fontSize: 14, fontWeight: '800' as const },
	previewContent: { flex: 1, gap: 3 },
	muted: { color: '#b5bac1', fontSize: 12 },
	previewName: { color: '#f2f3f5', fontSize: 15, fontWeight: '700' as const },
	previewText: { color: '#dbdee1', fontSize: 13 },
	button: {
		alignItems: 'center' as const,
		backgroundColor: '#5865f2',
		borderRadius: 6,
		minHeight: 44,
		justifyContent: 'center' as const,
		paddingHorizontal: 16,
	},
	buttonText: { color: '#fff', fontSize: 14, fontWeight: '700' as const },
	clearButton: { backgroundColor: '#4e5058' },
};

function sendActivity(activity: PresenceDraft | null) {
	void metro.common.Dispatcher.dispatch({
		type: 'LOCAL_ACTIVITY_UPDATE',
		activity: activity ? { ...activity } : null,
		socketId: SOCKET_ID,
	});
}

export function SettingsPanel() {
	const [presence, setPresence] = useState({ ...draft });

	function update<K extends keyof PresenceDraft>(key: K, value: PresenceDraft[K]) {
		const next = { ...presence, [key]: value };
		draft = next;
		setPresence(next);
	}

	const activityType = ACTIVITY_TYPES.find((item) => item.value === presence.type)?.label ?? 'Playing';

	return (
		<ScrollView contentContainerStyle={styles.page}>
			<Text style={styles.heading}>Custom Rich Presence</Text>

			<View style={styles.section}>
				<View>
					<Text style={styles.label}>Activity name</Text>
					<TextInput
						maxLength={128}
						onChangeText={(value) => update('name', value)}
						placeholder="My Activity"
						placeholderTextColor="#80848e"
						style={styles.field}
						value={presence.name}
					/>
				</View>
				<View>
					<Text style={styles.label}>Details</Text>
					<TextInput
						maxLength={128}
						onChangeText={(value) => update('details', value)}
						placeholder="What I am doing"
						placeholderTextColor="#80848e"
						style={styles.field}
						value={presence.details}
					/>
				</View>
				<View>
					<Text style={styles.label}>State</Text>
					<TextInput
						maxLength={128}
						onChangeText={(value) => update('state', value)}
						placeholder="A little more detail"
						placeholderTextColor="#80848e"
						style={styles.field}
						value={presence.state}
					/>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.label}>Activity type</Text>
				<View style={styles.typeRow}>
					{ACTIVITY_TYPES.map((item) => {
						const selected = item.value === presence.type;
						return (
							<Pressable
								key={item.value}
								onPress={() => update('type', item.value)}
								style={[styles.typeButton, selected && styles.typeButtonSelected]}
							>
								<Text style={[styles.typeText, selected && styles.buttonText]}>{item.label}</Text>
							</Pressable>
						);
					})}
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.label}>Preview · only visible to you</Text>
				<View style={styles.preview}>
					<View style={styles.previewIcon}>
						<Text style={styles.previewIconText}>RPC</Text>
					</View>
					<View style={styles.previewContent}>
						<Text style={styles.muted}>Playing a game</Text>
						<Text style={styles.previewName}>{presence.name || 'My Activity'}</Text>
						{presence.details ? <Text style={styles.previewText}>{presence.details}</Text> : null}
						{presence.state ? <Text style={styles.previewText}>{presence.state}</Text> : null}
						<Text style={styles.muted}>{activityType}</Text>
					</View>
				</View>
			</View>

			<Pressable onPress={() => sendActivity(presence)} style={styles.button}>
				<Text style={styles.buttonText}>Apply to Discord</Text>
			</Pressable>
			<Pressable onPress={() => sendActivity(null)} style={[styles.button, styles.clearButton]}>
				<Text style={styles.buttonText}>Clear presence</Text>
			</Pressable>
		</ScrollView>
	);
}

export default {
	start() {},
	stop() {
		sendActivity(null);
	},
};
