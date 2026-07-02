<script lang="ts">
    import { SearchIcon } from '@lucide/svelte';
    import { Button, Flex, ButtonGroup } from 'azucar-ui';
    import Select from '$lib/components/Select.svelte';
    import { StoragePaths } from '$lib/types/types.d';

    let {
        school = $bindable(''),
        major = $bindable(''),
        year = $bindable('1A'),
        minor = $bindable(''),
        course = $bindable(''),
        initialSchoolList = []
    } = $props();

    let schoolList = $state<string[]>(initialSchoolList);
    let majorList = $state<string[]>([]);
    let minorList = $state<string[]>([]);
    let courseList = $state<string[]>([]);

    $effect(() => {
        if (schoolList.length === 0) {
            fetchSelectionOptions('').then(list => schoolList = list);
        }
    });

    async function fetchSelectionOptions(subPath: string): Promise<string[]> {
        try {
            const pathParam = `${StoragePaths.DEFAULT_DB_LOCATION}/${subPath}/`;
            const response = await fetch(`/api/get-files-at?path=${encodeURIComponent(pathParam)}`);
            if (!response.ok) return [];
            const files: { name: string; isDirectory: boolean }[] = await response.json();
            return files.map(item => item.name);
        } catch {
            return [];
        }
    }

    const dependencyGraph = [
        {
            get keys() { return [school]; },
            path: (deps: string[]) => `${deps[0]}`,
            set options(val: string[]) { majorList = val; },
            reset: () => major = ""
        },
        {
            get keys() { return [school, major, year]; },
            path: (deps: string[]) => `${deps[0]}/${deps[1]}/${deps[2]}`,
            set options(val: string[]) { minorList = val; },
            reset: () => minor = ""
        },
        {
            get keys() { return [school, major, year, minor]; },
            path: (deps: string[]) => `${deps[0]}/${deps[1]}/${deps[2]}/${deps[3]}`,
            set options(val: string[]) { courseList = val; },
            reset: () => course = ""
        }
    ];

    $effect(() => {
        for (const node of dependencyGraph) {
            const currentDeps = node.keys; 
            if (currentDeps.some(dep => !dep)) {
                node.options = [];
                node.reset();
                continue;
            }
            const computedPath = node.path(currentDeps);
            fetchSelectionOptions(computedPath).then(list => {
                node.options = list;
            });
        }
    });
</script>

<Flex gap="md" align="center" wrap>
    <Select
        name="school"
        options={schoolList}
        bind:value={school}
        icon={SearchIcon}
        type="datalist"
        placeholder="Choisir une école"
        required
    >École</Select>

    <Select
        name="major"
        options={majorList}
        bind:value={major}
        icon={SearchIcon}
        placeholder="Choisir un département"
        type="datalist"
        disabled={!school}
        required
    >Département</Select>

    <Flex direction="column" gap="xxs">
        <span class="required">Niveau</span>
        <input type="hidden" name="year" value={year} />
        <ButtonGroup>
            {#each ['1A', '2A', '3A'] as y}
                <Button
                    type="button"
                    variant={year === y ? 'default' : 'outline'}
                    onclick={() => year = y}
                >{y}</Button>
            {/each}
        </ButtonGroup>
    </Flex>

    <Select
        name="minor"
        options={minorList}
        bind:value={minor}
        icon={SearchIcon}
        placeholder="Choisir une filière"
        disabled={!major}
        type="datalist"
        required
    >Filière</Select>

    <Select
        name="course"
        options={courseList}
        bind:value={course}
        icon={SearchIcon}
        placeholder="Choisir une matière"
        disabled={!minor}
        type="datalist"
        required
    >Matière</Select>
</Flex>
