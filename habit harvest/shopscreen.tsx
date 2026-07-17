import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

// ... (inside your ShopScreen component)
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

// Change the "See all" button to look like this:
<TouchableOpacity
    className="flex-row items-center"
    onPress={() => navigation.navigate('ProductGrid', {
        title: section.title,
        categoryId: section.id
    })}
>
    <Text className="text-sm font-bold text-[#216C3F] mr-1">See all</Text>
    <Feather name="chevron-right" size={16} color="#216C3F" />
</TouchableOpacity>